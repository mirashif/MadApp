import {makeAutoObservable} from 'mobx';
import {Store} from '.';
import {AddonType, Item, VariantGroupType} from './ItemStore';

export interface CategoryType {
    id: string;
    restaurantID: string;
    isAvailable?: boolean;

    name: string;
    hash: string;

    itemOrder?: {
        [itemID: string]: number;
    };

    variantGroupOrder?: {
        [variantGroupID: string]: number;
    };

    variantGroups: {
        [variantGroupID: string]: VariantGroupType;
    };

    addonOrder: {
        [addonID: string]: number;
    };

    addons: {
        [addonID: string]: AddonType;
    };

    addonLimit: number;
}

export class Category {
    parent: CategoryStore;
    data: CategoryType;

    constructor(parent: CategoryStore, data: CategoryType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get id() {
        return this.data.id;
    }

    get isAvailable() {
        const currentBranch = this.parent.parent.restaurants.get(
            this.data.restaurantID,
        )?.availableBranches[0];

        return !this.data.isAvailable
            ? false
            : !currentBranch?.data.unavailableCategories?.[this.id];
    }

    get items(): Item[] {
        const category = this.parent.parent.categories.get(this.id);

        return Object.keys(
            this.parent.parent.items.itemsByCategory[this.id] || {},
        )
            .map((id) => this.parent.parent.items.items[id] || null)
            .filter((item) => !!item)
            .sort((a, b) => {
                const orderA = category?.data?.itemOrder?.[a.id] || 0;
                const orderB = category?.data?.itemOrder?.[b.id] || 0;

                return orderA - orderB;
            });
    }
}

export class CategoryStore {
    parent: Store;
    listener: (() => void) | null = null;

    categories: {
        [id: string]: Category;
    } = {};

    categoriesByRestaurant: {
        [restaurantID: string]: {
            [categoryID: string]: true;
        };
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: CategoryType): void {
        this.categories[id] = new Category(this, data);

        if (!(data.restaurantID in this.categoriesByRestaurant)) {
            this.categoriesByRestaurant[data.restaurantID] = {};
        }

        this.categoriesByRestaurant[data.restaurantID][id] = true;
    }

    remove(id: string): void {
        const restaurantID = this.categories[id].data.restaurantID;

        delete this.categoriesByRestaurant[restaurantID][id];
        delete this.categories[id];
    }

    listen(): void {
        this.listener = this.parent.firebase
            .firestore()
            .collectionGroup('categories')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <CategoryType>change.doc.data(),
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

    get(id: string): Category | null {
        return this.categories[id] || null;
    }
}
