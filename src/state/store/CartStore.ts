import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {CartablePacket} from './Cartable';
import {profile} from '../helpers/profile';

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
        const _p = profile('CartStore.upsert');

        if (cartablePacket.data.id in this.cart) {
            this.cart[cartablePacket.data.id].data.count =
                cartablePacket.data.count +
                this.cart[cartablePacket.data.id].data.count;
        } else {
            this.cart[cartablePacket.data.id] = cartablePacket;
        }

        _p();
    }

    get all() {
        const _p = profile('CartStore.all');

        return _p(Object.values(this.cart));
    }
}
