import {makeAutoObservable, when} from 'mobx';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {toGenerator} from '../helpers/toGenerator';
import {OrderableType} from './CartStore';

export interface OrderType extends OrderableType {
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

    upsert(id: string, doc: OrderType): void {
        this.orders[id] = doc;

        if (this.minTime > doc.createdAt.toMillis()) {
            this.minTime = doc.createdAt.toMillis();
        }
    }

    remove(id: string): void {
        delete this.orders[id];
    }

    listen(): void {
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
            });
    }

    unlisten(): void {
        if (this.listener) {
            this.listener();
        }
    }

    *loadPage() {
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
    }

    get activeOrders(): OrderType[] {
        return Object.keys(this.recentOrders)
            .map((id) => this.orders[id])
            .filter((order) => order.active);
    }

    get pageCount() {
        return this.pages.length + 1;
    }

    get orderPages(): OrderType[][] {
        return [
            Object.keys(this.recentOrders).map((id) => this.orders[id]),
        ].concat(
            this.pages.map((page) => {
                return Object.keys(page).map((id) => {
                    return this.orders[id];
                });
            }),
        );
    }

    get(id: string) {
        return this.orders[id] || null;
    }

    *placeOrder(orderable: OrderableType) {
        this.error = null;

        const placeOrder = this.parent.firebase
            .functions()
            .httpsCallable('orders-placeOrder');

        try {
            const oldLength = this.activeOrders.length;
            const result = (yield* toGenerator(placeOrder(orderable))).data;

            yield* toGenerator(
                when(() => this.activeOrders.length > oldLength),
            );

            return result;
        } catch (error) {
            this.error = error;
        }
    }

    clearErrors() {
        this.error = null;
    }
}
