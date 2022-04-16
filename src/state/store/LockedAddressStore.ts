import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {Address} from './AddressStore';
import {profile} from '../helpers/profile';

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
        const _p = profile('LockedAddressStore.lockAddress');

        this._isActivelyLocked = true;
        this._locked = addressID;

        _p();
    }

    _passiveLock(addressID: string) {
        const _p = profile('LockedAddressStore._passiveLock');

        this._locked = addressID;

        _p();
    }

    get lockedAddress(): Address | null {
        const _p = profile('LockedAddressStore.lockedAddress');

        return _p(
            this._locked ? this.parent.addresses.get(this._locked) : null,
        );
    }
}
