import {flow, makeAutoObservable} from 'mobx';

// @ts-ignore
import geodist from 'geodist';

import {v4 as uuidv4} from 'uuid';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

const DISTANCE_SYMBOL = Symbol('DISTANCE');

export interface UnsavedAddress {
    lon: number;
    lat: number;
    address: string;
    directions: string | null;

    label?: string;

    lastUsed?: FirebaseFirestoreTypes.Timestamp;
}

export interface AddressType extends UnsavedAddress {
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
        return geodist(
            this.parent.location,
            {
                lon: this.data.lon,
                lat: this.data.lat,
            },
            {
                unit: 'meters',
                exact: true,
            },
        ) as number;
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

    upsert(id: string, data: AddressType) {
        this.addresses[id] = new Address(this, data);
    }

    remove(id: string) {
        delete this.addresses[id];
    }

    listen() {
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
            });
    }

    unlisten() {
        if (this.listener) {
            this.listener();
            this.listener = null;
        }
    }

    get all() {
        return Object.values(this.addresses).sort((a, b) => {
            if (!a?.data?.lastUsed || !b?.data?.lastUsed) {
                return -1;
            }

            return a?.data?.lastUsed.toMillis() - b?.data.lastUsed?.toMillis();
        });
    }

    get(id: string): Address | null {
        if (id === 'location') {
            if (this.location) {
                return this.locationAddress;
            } else {
                return this.defaultAddress;
            }
        } else {
            return this.addresses[id] || null;
        }
    }

    setLocation(lon: number, lat: number) {
        this.location = {lon, lat};
    }

    *infer() {
        // TODO
    }

    *addAddress(addressable: UnsavedAddress) {
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

        return id;
    }

    get locationAddress(): Address | null {
        // TODO
        return this.location
            ? new Address(this, {
                  id: 'location',
                  address: '',
                  directions: '',
                  lat: this.location.lat,
                  lon: this.location.lon,
              })
            : null;
    }

    get nearbyAddresses() {
        return this.all
            .filter((address) => (address?.distance || 0) < 4000)
            .sort((a, b) => (a?.distance || 0) - (b?.distance || 0));
    }

    get closestAddress() {
        return this.nearbyAddresses[0] || null;
    }

    get defaultAddress() {
        if (this.location) {
            return this.closestAddress || this.locationAddress;
        } else {
            if (this.all.length) {
                return this.all[0];
            } else {
                return null;
            }
        }
    }

    *updateAddress(id: string, addressable: AddressType) {
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

        return id;
    }

    *deleteAddress(id: string) {
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
    }
}
