import {makeAutoObservable} from 'mobx';

export class OrderStore {
    listening = 0;
    listener = null;

    // {[orderID: string]: Order}
    orders = {};

    // Set<string>[]
    _pages = [];
    recentOrders = [];

    // If all orders has been loaded or not.
    allLoaded = false;

    constructor(parent) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    listen() {}

    unlisten() {
        if (this.listener) {
            this.listener();
        }
    }

    watch() {
        this.listening++;
    }

    unwatch() {
        this.listening--;
    }

    getOrder(orderID) {
        return this.orders[orderID];
    }

    *loadPage() {}

    get(orderID) {
        return this.orders[orderID];
    }

    get all() {
        return Object.values(this.orders);
    }

    get pages() {
        return [this.recentOrders.map((id) => this.orders[id])].concat(
            this._pages.map((page) => [...page].map((id) => this.orders[id])),
        );
    }
}
