import {makeAutoObservable} from 'mobx';

// @ts-ignore
import geodist from 'geodist';

import {Store} from './index';
import {RestaurantWithAvailabilityType} from './RestaurantStore';

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
}

export interface BranchWithAvailabilityType extends BranchType {
    isAvailable: boolean;
}

export class BranchStore {
    parent: Store;
    listener: (() => void) | null = null;

    branches: {
        [key: string]: BranchType;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: BranchType): void {
        this.branches[id] = data;
    }

    remove(id: string): void {
        delete this.branches[id];
    }

    listen(): void {
        this.listener = this.parent.firebase
            .firestore()
            .collectionGroup('branches')
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

    isBranchAvailable(id: string): boolean {
        // TODO: this is not the final form

        if (!this.branches[id]) {
            return false;
        }

        const branch = this.branches[id];
        const lockedAddress = this.parent.lockedAddress.lockedAddress;

        if (!branch || !lockedAddress) {
            return false;
        }

        const distance = geodist(
            {
                lon: lockedAddress.lon,
                lat: lockedAddress.lat,
            },
            {
                lon: branch.location.lon,
                lat: branch.location.lat,
            },
            {unit: 'meters'},
        );

        return distance < 2000;
    }

    get all() {
        return Object.values(this.branches).map((branch) => {
            return {
                ...branch,
                isAvailable: this.isBranchAvailable(branch.id),
            };
        });
    }

    get availableBranches() {
        return this.all.filter((branch) => branch.isAvailable);
    }

    availableFor(restaurantID: string): BranchType[] {
        return this.availableBranches.filter(
            (branch) => branch.restaurantID === restaurantID,
        );
    }

    get(id: string): BranchWithAvailabilityType | null {
        if (this.branches[id]) {
            return null;
        }

        return {
            ...this.branches[id],
            isAvailable: this.isBranchAvailable(id),
        };
    }

    restaurantOf(branchID: string): RestaurantWithAvailabilityType | null {
        const branch = this.get(branchID);

        if (!branch) {
            return null;
        }

        return this.parent.restaurants.get(branch.restaurantID);
    }
}
