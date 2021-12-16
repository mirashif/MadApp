import {makeAutoObservable} from 'mobx';

// @ts-ignore
import geodist from 'geodist';
import {Store} from './index';

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

        return distance < 2000;
    }

    get restaurant() {
        return this.parent.parent.restaurants.get(this.data.restaurantID);
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

    upsert(id: string, data: BranchType): void {
        this.branches[id] = new Branch(this, data);
    }

    remove(id: string): void {
        delete this.branches[id];
    }

    listen(): void {
        this.listener = this.parent.firebase
            .firestore()
            .collectionGroup('branches')
            .where('isAvailable', '==', true)
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
            });
    }

    unlisten(): void {
        if (this.listener) {
            this.listener();
            this.listener = null;
        }
    }

    get all(): Branch[] {
        return Object.values(this.branches);
    }

    get availableBranches() {
        return this.all.filter((branch) => branch.isAvailable);
    }

    get(id: string): Branch | null {
        return this.branches[id] || null;
    }
}
