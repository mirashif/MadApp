import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {toGenerator} from '../helpers/toGenerator';
import {profile} from '../helpers/profile';

// import {OrderableType} from './CartStore';

export interface OrderType {
    id: string;
    userID: string;

    active: boolean;
    stage:
        | 'payment-waiting'
        | 'paid'
        | 'waiting'
        | 'accepted'
        | 'preparing'
        | 'prepared'
        | 'picked-up'
        | 'delivering'
        | 'delivered';

    paymentComplete: boolean;
    paymentURL?: string;

    createdAt: FirebaseFirestoreTypes.Timestamp;
}

export class OrderStore {
    parent: Store;

    listener: null | (() => void) = null;
    error: null | any;

    orders: {
        [id: string]: OrderType;
    } = {};

    recentOrders: {
        [id: string]: boolean;
    } = {};

    pages: {
        [id: string]: boolean;
    }[] = [];

    minTime: number = Date.now();

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    _ready = false;

    get ready() {
        return !this.parent.auth.user || this._ready;
    }

    setReady(ready: boolean = true) {
        this._ready = ready;
    }

    upsert(id: string, doc: OrderType): void {
        const _p = profile('OrderStore.upsert');

        this.orders[id] = doc;

        if (this.minTime > doc.createdAt.toMillis()) {
            this.minTime = doc.createdAt.toMillis();
        }

        _p();
    }

    remove(id: string): void {
        const _p = profile('OrderStore.remove');

        delete this.orders[id];

        _p();
    }

    listen(): void {
        const _p = profile('OrderStore.listen');

        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error('Cannot listen before user initialization.');
        }

        this.listener = this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user.uid)
            .collection('orders')
            .where(
                'createdAt',
                '>=',
                new Date(Date.now() - 24 * 60 * 60 * 1000),
            )
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <OrderType>change.doc.data(),
                        );

                        this.recentOrders[change.doc.id] = true;
                    } else if (change.type === 'removed') {
                        this.remove(change.doc.id);
                        delete this.recentOrders[change.doc.id];
                    }
                });

                this.setReady();
            });

        _p();
    }

    unlisten(): void {
        const _p = profile('OrderStore.unlisten');

        if (this.listener) {
            this.listener();
        }

        _p();
    }

    *loadPage() {
        const _p = profile('OrderStore.loadPage');

        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error('Cannot listen before user initialization.');
        }

        const snap = yield* toGenerator(
            this.parent.firebase
                .firestore()
                .collection('users')
                .doc(this.parent.auth.user.uid)
                .collection('orders')
                .where('createdAt', '<', new Date(this.minTime))
                .limit(15)
                .get(),
        );

        snap.forEach((doc) => this.upsert(doc.id, <OrderType>doc.data()));

        _p();
    }

    get activeOrders(): OrderType[] {
        const _p = profile('OrderStore.activeOrders');

        return _p(
            Object.keys(this.recentOrders)
                .map((id) => this.orders[id])
                .filter((order) => order.active),
        );
    }

    get pageCount() {
        const _p = profile('OrderStore.pageCount');

        return _p(this.pages.length + 1);
    }

    get orderPages(): OrderType[][] {
        const _p = profile('OrderStore.orderPages');

        return _p(
            [
                Object.keys(this.recentOrders).map((id) => this.orders[id]),
            ].concat(
                this.pages.map((page) => {
                    return Object.keys(page).map((id) => {
                        return this.orders[id];
                    });
                }),
            ),
        );
    }

    get(id: string) {
        const _p = profile('OrderStore.get');

        return _p(this.orders[id] || null);
    }

    clearErrors() {
        const _p = profile('OrderStore.clearErrors');

        this.error = null;

        _p();
    }
}
