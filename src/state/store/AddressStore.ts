import {makeAutoObservable} from 'mobx';

// @ts-ignore
import geodist from 'geodist';

import {v4 as uuidv4} from 'uuid';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AddressBuilder} from './AddressBuilder';
import {profile} from '../helpers/profile';

export interface UnsavedAddressType {
    lon: number;
    lat: number;
    address: string;
    directions: string | null;

    label?: string;

    lastUsed?: FirebaseFirestoreTypes.Timestamp;
}

export interface AddressType extends UnsavedAddressType {
    id: string;
}

export class Address {
    parent: AddressStore;
    data: AddressType;

    constructor(parent: AddressStore, data: AddressType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get distance() {
        const _p = profile('Address.distance');

        return _p(
            geodist(
                this.parent.location,
                {
                    lon: this.data.lon,
                    lat: this.data.lat,
                },
                {
                    unit: 'meters',
                    exact: true,
                },
            ) as number,
        );
    }

    get builder() {
        const _p = profile('Address.builder');

        return _p(new AddressBuilder(this.parent.parent, this.data));
    }
}

export class AddressStore {
    parent: Store;
    listener: (() => void) | null = null;

    addresses: {
        [id: string]: Address;
    } = {};

    location: {lat: number; lon: number} | null = null;
    _inferredAddress: string | null = null;

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

    upsert(id: string, data: AddressType) {
        const _p = profile('AddressStore.upsert');

        this.addresses[id] = new Address(this, data);

        _p();
    }

    remove(id: string) {
        const _p = profile('AddressStore.remove');

        delete this.addresses[id];

        _p();
    }

    listen() {
        const _p = profile('AddressStore.listen');

        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error("Can't listen if auth-user is not initialized.");
        }

        this.listener = this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user?.uid)
            .collection('addresses')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(change.doc.id, change.doc.data() as any);
                    } else if (change.type === 'removed') {
                        this.remove(change.doc.id);
                    }
                });

                this.setReady();
            });

        _p();
    }

    unlisten() {
        const _p = profile('AddressStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }

    get all() {
        const _p = profile('AddressStore.all');

        return _p(
            Object.values(this.addresses).sort((a, b) => {
                if (!a?.data?.lastUsed || !b?.data?.lastUsed) {
                    return -1;
                }

                return (
                    a?.data?.lastUsed?.toMillis() - b?.data.lastUsed?.toMillis()
                );
            }),
        );
    }

    setLocation(lon: number, lat: number) {
        const _p = profile('AddressStore.setLocation');

        this.location = {lon, lat};

        _p();
    }

    *infer() {
        const _p = profile('AddressStore.infer');

        // TODO

        _p();
    }

    get lastUsed(): Address | null {
        const _p = profile('AddressStore.lastUsed');

        return _p(this.all[0]);
    }

    get closestAddress(): Address | null {
        const _p = profile('AddressStore.closestAddress');

        if (!this.isLocationAddressAvailable) {
            return null;
        }

        let min: Address | null = null;

        this.all.forEach((address) => {
            if (min === null || min?.distance > address.distance) {
                min = address;
            }
        });

        return _p(min);
    }

    get locationAddress(): Address | null {
        const _p = profile('AddressStore.locationAddress');

        return _p(
            this.isLocationAddressAvailable
                ? new Address(this, {
                      id: 'location',
                      lon: this.location?.lon || 0,
                      lat: this.location?.lat || 0,
                      address: this._inferredAddress || '',
                      directions: '',
                  })
                : null,
        );
    }

    get isLocationAddressAvailable() {
        const _p = profile('AddressStore.isLocationAddressAvailable');

        return _p(!!this.location);
    }

    get(addressID: string): Address | null {
        const _p = profile('AddressStore.get');

        if (addressID === 'location') {
            return _p(this.locationAddress);
        } else {
            return _p(this.addresses[addressID] || null);
        }
    }

    *addAddress(addressable: UnsavedAddressType) {
        const _p = profile('AddressStore.addAddress');

        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error(
                "Can't save address if auth-user is not initialized.",
            );
        }

        const id = uuidv4();

        yield this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user?.uid)
            .collection('addresses')
            .doc(id)
            .set(
                {
                    ...addressable,
                    id: id,
                },
                {merge: true},
            );

        return _p(id);
    }

    *updateAddress(id: string, addressable: Partial<UnsavedAddressType>) {
        const _p = profile('AddressStore.updateAddress');

        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error(
                "Can't save address if auth-user is not initialized.",
            );
        }

        yield this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user?.uid)
            .collection('addresses')
            .doc(id)
            .set(
                {
                    ...addressable,
                    id: id,
                },
                {merge: true},
            );

        return _p(id);
    }

    *deleteAddress(id: string) {
        const _p = profile('AddressStore.deleteAddress');

        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error(
                "Auth-user not initialized, don't know what to delete.",
            );
        }

        yield this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user?.uid)
            .collection('addresses')
            .doc(id)
            .delete();

        _p();
    }

    get builder() {
        const _p = profile('AddressStore.builder');

        return _p(new AddressBuilder(this.parent));
    }
}
