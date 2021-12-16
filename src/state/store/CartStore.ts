import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {CartablePacket} from './Cartable';

export class CartStore {
    parent: Store;

    cart: {
        [cartableID: string]: CartablePacket;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;
        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(cartablePacket: CartablePacket) {
        if (cartablePacket.data.id in this.cart) {
            this.cart[cartablePacket.data.id].data.count =
                cartablePacket.data.count +
                this.cart[cartablePacket.data.id].data.count;
        } else {
            this.cart[cartablePacket.data.id] = cartablePacket;
        }
    }

    get all() {
        return Object.values(this.cart);
    }
}
