import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {Address} from './AddressStore';

export class LockedAddressStore {
    parent: Store;

    // Address ID
    _locked: string | null = null;
    _isActivelyLocked: boolean = false;

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    lockAddress(addressID: string) {
        this._isActivelyLocked = true;
        this._locked = addressID;
    }

    _passiveLock(addressID: string) {
        this._locked = addressID;
    }

    get lockedAddress(): Address | null {
        return this._locked ? this.parent.addresses.get(this._locked) : null;
    }
}
