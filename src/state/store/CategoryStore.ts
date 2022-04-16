import {makeAutoObservable} from 'mobx';
import {Store} from '.';
import {AddonType, CategoryVariantGroupType, Item} from './ItemStore';
import {profile} from '../helpers/profile';

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
        [variantGroupID: string]: CategoryVariantGroupType;
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
        const _p = profile('Category.id');

        return _p(this.data.id);
    }

    get isAvailable() {
        const _p = profile('Category.isAvailable');

        const currentBranch = this.parent.parent.restaurants.get(
            this.data.restaurantID,
        )?.availableBranches[0];

        return _p(
            this.data.isAvailable === false
                ? false
                : !currentBranch?.data.unavailableCategories?.[this.id],
        );
    }

    get items(): Item[] {
        const _p = profile('Category.items');

        const category = this.parent.parent.categories.get(this.id);

        return _p(
            Object.keys(this.parent.parent.items.itemsByCategory[this.id] || {})
                .map((id) => this.parent.parent.items.items[id] || null)
                .filter((item) => !!item)
                .sort((a, b) => {
                    const orderA = category?.data?.itemOrder?.[a.id] || 0;
                    const orderB = category?.data?.itemOrder?.[b.id] || 0;

                    return orderA - orderB;
                }),
        );
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

    ready = false;

    setReady(ready: boolean = true) {
        this.ready = ready;
    }

    upsert(id: string, data: CategoryType): void {
        const _p = profile('CategoryStore.upsert');

        this.categories[id] = new Category(this, data);

        if (!(data.restaurantID in this.categoriesByRestaurant)) {
            this.categoriesByRestaurant[data.restaurantID] = {};
        }

        this.categoriesByRestaurant[data.restaurantID][id] = true;

        _p();
    }

    remove(id: string): void {
        const _p = profile('CategoryStore.remove');

        const restaurantID = this.categories[id].data.restaurantID;

        delete this.categoriesByRestaurant[restaurantID][id];
        delete this.categories[id];

        _p();
    }

    listen(): void {
        const _p = profile('CategoryStore.listen');

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

                this.setReady();
            });

        _p();
    }

    unlisten(): void {
        const _p = profile('CategoryStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }

    get(id: string): Category | null {
        const _p = profile('CategoryStore.get');

        return _p(this.categories[id] || null);
    }
}
