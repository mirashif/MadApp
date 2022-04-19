import {makeAutoObservable} from 'mobx';

// @ts-ignore
import geodist from 'geodist';
import {Store} from './index';
import {profile} from '../helpers/profile';

export interface BranchType {
    id: string;
    restaurantID: string;

    name: string;
    address: string;

    location: {
        lat: number;
        lon: number;
    };

    unavailableItems: {
        [id: string]: true;
    };

    unavailableCategories: {
        [id: string]: true;
    };

    isAvailable: boolean;
}

export class Branch {
    parent: BranchStore;
    data: BranchType;

    constructor(parent: BranchStore, data: BranchType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get isAvailable() {
        const _p = profile('Branch.isAvailable');

        const lockedAddress = this.parent.parent.lockedAddress.lockedAddress;

        if (!lockedAddress) {
            return false;
        }

        const distance = geodist(
            {
                lon: lockedAddress.data.lon,
                lat: lockedAddress.data.lat,
            },
            {
                lon: this.data.location.lon,
                lat: this.data.location.lat,
            },
            {unit: 'meters'},
        );

        return _p(distance < 2000);
    }

    get restaurant() {
        const _p = profile('Branch.restaurant');

        return _p(this.parent.parent.restaurants.get(this.data.restaurantID));
    }
}

export class BranchStore {
    parent: Store;
    listener: (() => void) | null = null;

    branches: {
        [key: string]: Branch;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    ready = false;

    setReady(ready: boolean = true) {
        this.ready = ready;
    }

    upsert(id: string, data: BranchType): void {
        const _p = profile('BranchStore.upsert');

        this.branches[id] = new Branch(this, data);
        _p();
    }

    remove(id: string): void {
        const _p = profile('BranchStore.remove');

        delete this.branches[id];

        _p();
    }

    listen(): void {
        const _p = profile('BranchStore.listen');

        this.listener = this.parent.firebase
            .firestore()
            .collection('branches')
            // .where('isAvailable', '==', true)
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <BranchType>change.doc.data(),
                        );
                    } else if (change.type === 'removed') {
                        this.remove(change.doc.id);
                    }
                });

                this.setReady();
            });

        _p();
    }

    unlisten(): void {
        const _p = profile('BranchStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }

    get all(): Branch[] {
        const _p = profile('BranchStore.all');
        return _p(Object.values(this.branches));
    }

    get availableBranches() {
        const _p = profile('Branch.availableBranches');

        return _p(this.all.filter((branch) => branch.isAvailable));
    }

    get(id: string): Branch | null {
        const _p = profile('BranchStore.get');

        return _p(this.branches[id] || null);
    }
}
