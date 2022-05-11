import {makeAutoObservable, when} from 'mobx';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {profile} from '../helpers/profile';
import {SerializedCartable} from './Cartable';
import {composeFlow} from '../helpers/composeFlow';
import {v4 as uuidv4} from 'uuid';

export interface OrderableInterface {
    cart: SerializedCartable[];
    specialInstructions: string;
    couponCode: string | null;
    address: {
        addressID: string;
        lat: number;
        lon: number;
        address: string;
        directions: string | null;
        label: string | null;
    };
    payments: {
        method: 'cash-on-delivery' | 'bkash' | 'card';
        grandTotalAmount: number;
        deliveryChargeAmount: number;
        discountAmount: number;
        serviceChargeAmount: number;
        vatAmount: number;
        subtotalAmount: number;
        originalTotal: number;
    };
}

export interface OrderType extends OrderableInterface {
    id: string;
    userID: string;
    orderNumber: string;

    active: boolean;
    stage:
        | 'waiting'
        | 'accepted'
        | 'preparing'
        | 'prepared'
        | 'picked-up'
        | 'delivering'
        | 'delivered'
        | 'cancelled';

    paymentRequired: boolean;
    paymentURL?: string;

    timeLeft:
        | {
              from: number;
              to: number;
          }
        | {
              lessThan: number;
          }
        | {
              string: string;
          };

    displayText: string;
    createdAt: FirebaseFirestoreTypes.Timestamp;
}

export class Order {
    parent: OrderStore;
    data: OrderType;

    constructor(parent: OrderStore, data: OrderType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get getTriStage(): 'waiting' | 'preparing' | 'delivering' | 'complete' {
        return (
            {
                waiting: 'waiting',
                accepted: 'preparing',
                preparing: 'preparing',
                prepared: 'preparing',
                'picked-up': 'delivering',
                delivering: 'delivering',
                delivered: 'complete',
                cancelled: 'complete',
            } as {
                [key: string]:
                    | 'waiting'
                    | 'preparing'
                    | 'delivering'
                    | 'complete';
            }
        )[this.data.stage];
    }

    get simplifiedStage(): 'waiting' | 'active' | 'delivered' | 'cancelled' {
        return (
            {
                waiting: 'waiting',
                accepted: 'active',
                preparing: 'active',
                prepared: 'active',
                'picked-up': 'active',
                delivering: 'active',
                delivered: 'delivered',
                cancelled: 'cancelled',
            } as {
                [key: string]: 'waiting' | 'active' | 'delivered' | 'cancelled';
            }
        )[this.data.stage];
    }

    get restaurantNames(): string[] {
        const restaurantIDs = [
            ...new Set(
                this.data.cart.map((cartable) => cartable.item.restaurantID),
            ),
        ];

        return restaurantIDs
            .map(
                (id) => this.parent.parent.restaurants.get(id)?.data.name ?? '',
            )
            .filter((name) => !!name);
    }
}

export class OrderPage {
    constructor(public parent: OrderStore, public orderIDs: string[]) {}

    add(orderID: string) {
        this.orderIDs.push(orderID);
    }

    get all() {
        return this.orderIDs
            .map((id) => this.parent.get(id))
            .sort((a, b) => {
                return (
                    (b?.data?.createdAt?.toMillis() || 0) -
                    (a?.data?.createdAt?.toMillis() || 0)
                );
            });
    }
}

export class OrderStore {
    parent: Store;
    listener: (() => void) | null = null;

    orders: {
        [key: string]: Order;
    } = {};

    pages: OrderPage[] = [new OrderPage(this, [])];

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

    upsert(id: string, data: OrderType): void {
        const _p = profile('OrderStore.upsert');

        this.orders[id] = new Order(this, data);

        _p();
    }

    remove(id: string): void {
        const _p = profile('OrderStore.remove');

        delete this.orders[id];

        _p();
    }

    listen() {
        const _p = profile('OrderStore.listen');

        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error("Can't listen if auth-user is not initialized.");
        }

        const since = new Date();
        since.setHours(since.getHours() - 24);

        this.listener = this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user?.uid)
            .collection('orders')
            .where('createdAt', '>', since)
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <OrderType>change.doc.data(),
                        );

                        this.pages[0].add(change.doc.id);
                    } else if (change.type === 'removed') {
                        this.remove(change.doc.id);
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
            this.listener = null;
        }

        _p();
    }

    *loadPage() {
        if (!this.parent.auth.user || this.parent.auth.user === true) {
            return;
        }

        const lastPage = this.pages[this.pages.length - 1];
        const lastOrder = lastPage.all[lastPage.all.length - 1];
        const lastOrderTime = lastOrder?.data.createdAt;

        const orderSnap = yield* composeFlow(
            this.parent.firebase
                .firestore()
                .collection('users')
                .doc(this.parent.auth.user?.uid)
                .collection('orders')
                .where('createdAt', '<', lastOrderTime)
                .get(),
        );

        const orderIDs: string[] = [];

        orderSnap.forEach((doc) => {
            this.upsert(doc.id, doc.data() as OrderType);
            orderIDs.push(doc.id);
        });

        const page = new OrderPage(this, orderIDs);

        this.pages.push(page);
    }

    get(id: string): Order | null {
        const _p = profile('InviteStore.get');

        return _p(this.orders[id] || null);
    }

    *createOrder(orderable: OrderableInterface) {
        if (!this.parent.auth.user || this.parent.auth.user === true) {
            return;
        }

        const orderNumber = Math.round(Math.random() * 9999999);
        const orderNumberString = `${orderNumber}`.padStart(7, '0');
        const id = uuidv4();

        const order: OrderType = {
            ...orderable,
            id: id,
            userID: this.parent.auth.user?.uid,
            orderNumber: orderNumberString,
            active: true,
            stage: 'waiting',
            paymentRequired: orderable.payments.method !== 'cash-on-delivery',
            timeLeft: {
                string: 'WAITING',
            },
            displayText: 'WAITING',
            createdAt: FirebaseFirestoreTypes.Timestamp.fromDate(new Date()),
        };

        yield this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user?.uid)
            .collection('orders')
            .doc(id)
            .set(order);

        yield when(() => !!this.orders[id]);

        return id;
    }
}
