import {makeAutoObservable} from 'mobx';

// @ts-ignore
import geodist from 'geodist';

import {v4 as uuidv4} from 'uuid';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AddressBuilder} from './AddressBuilder';

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

    get builder() {
        return new AddressBuilder(this.parent.parent, this.data);
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

            return a?.data?.lastUsed?.toMillis() - b?.data.lastUsed?.toMillis();
        });
    }

    setLocation(lon: number, lat: number) {
        this.location = {lon, lat};
    }

    *infer() {
        // TODO
    }

    get lastUsed(): Address | null {
        return this.all[0];
    }

    get closestAddress(): Address | null {
        if (!this.isLocationAddressAvailable) {
            return null;
        }

        let min: Address | null = null;

        this.all.forEach((address) => {
            if (min === null || min?.distance > address.distance) {
                min = address;
            }
        });

        return min;
    }

    get locationAddress(): Address | null {
        return this.isLocationAddressAvailable
            ? new Address(this, {
                  id: 'location',
                  lon: this.location?.lon || 0,
                  lat: this.location?.lat || 0,
                  address: this._inferredAddress || '',
                  directions: '',
              })
            : null;
    }

    get isLocationAddressAvailable() {
        return !!this.location;
    }

    get(addressID: string): Address | null {
        if (addressID === 'location') {
            return this.locationAddress;
        } else {
            return this.addresses[addressID] || null;
        }
    }

    *addAddress(addressable: UnsavedAddressType) {
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

    *updateAddress(id: string, addressable: Partial<UnsavedAddressType>) {
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

    get builder() {
        return new AddressBuilder(this.parent);
    }
}
