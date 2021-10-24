import {makeAutoObservable} from 'mobx';
import {Store} from './index';

export class LockedAddressStore {
    parent: Store;

    // Address ID
    _locked: string | null = null;

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    lockAddress(addressID: string) {
        this._locked = addressID;
    }

    get lockedAddress() {
        return this._locked
            ? this.parent.addresses.get(this._locked)
            : this.parent.addresses.defaultAddress;
    }
}
