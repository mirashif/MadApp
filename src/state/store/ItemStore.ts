import {makeAutoObservable} from 'mobx';
import {Store} from './index';

export interface AddonType {
    id: string;
    price: number;
    name: string;
    description?: string;
    hash: string;

    specificCountLimit: number;
}

export interface VariantType {
    id: string;

    price: number;

    name: string;
    description?: string;

    hash: string;

    groupID: string;
}

export interface BaseVariantGroupType {
    id: string;

    name: string;
    description: string;

    variantOrder?: {
        [key: string]: number;
    };

    variants?: {
        [variantID: string]: VariantType;
    };
}

export interface CategoryVariantGroupType extends BaseVariantGroupType {
    categoryID: string;
}

export interface ItemVariantGroupType extends BaseVariantGroupType {
    itemID: string;
}

export type VariantGroupType = CategoryVariantGroupType | ItemVariantGroupType;

export interface VariantGroupOrderedViewType
    extends Omit<VariantGroupType, 'variants'> {
    variants: VariantType[];
}

export interface ItemType {
    id: string;
    categoryID: string;
    restaurantID: string;

    isAvailable?: boolean;
    isPopular?: boolean;

    tag?: string;
    originalPrice?: number;

    price: number;
    name: string;
    hash: string;

    description: string;

    thumbnailURI?: string;
    pictureURI?: string;

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
}

export interface ItemWithAvailabilityType extends ItemType {
    isAvailable: boolean;
}

export class ItemStore {
    parent: Store;
    listener: (() => void) | null = null;

    items: {
        [id: string]: ItemType;
    } = {};

    itemsByRestaurant: {
        [restaurantID: string]: {
            [itemID: string]: boolean;
        };
    } = {};

    itemsByCategory: {
        [categoryID: string]: {
            [itemID: string]: boolean;
        };
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: ItemType): void {
        if (this.items[id]) {
            this.remove(id);
        }

        this.items[id] = data;

        if (!(data.restaurantID in this.itemsByRestaurant)) {
            this.itemsByRestaurant[data.restaurantID] = {};
        }

        if (!(data.categoryID in this.itemsByCategory)) {
            this.itemsByCategory[data.categoryID] = {};
        }

        this.itemsByCategory[data.categoryID][id] = true;
        this.itemsByCategory[data.restaurantID][id] = true;
    }

    remove(id: string): void {
        delete this.itemsByCategory[this.items[id].categoryID][id];
        delete this.itemsByRestaurant[this.items[id].restaurantID][id];

        delete this.items[id];
    }

    listen(): void {
        this.listener = this.parent.firebase
            .firestore()
            .collectionGroup('items')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(change.doc.id, <ItemType>change.doc.data());
                    } else if (change.type === 'removed') {
                        this.remove(change.doc.id);
                    }
                });
            });
    }

    unlisten(): void {
        if (this.listener) {
            this.listener();
        }
    }

    isItemAvailable(item: ItemType): boolean {
        if (!item) {
            return false;
        }

        if (!item.isAvailable) {
            return false;
        } else {
            const restaurant = this.parent.restaurants.get(item.restaurantID);

            if (!restaurant) {
                return false;
            }

            const branch = this.parent.branches.availableFor(restaurant.id)[0];

            if (!branch) {
                return false;
            }

            return !(item.id in (branch?.unavailableItems || {}));
        }
    }

    getForCategory(categoryID: string): ItemWithAvailabilityType[] {
        const category = this.parent.categories.get(categoryID);

        return Object.keys(this.itemsByCategory[categoryID] || {})
            .map((id) => this.items[id] || null)
            .filter((item) => !!item)
            .map((item) => {
                return {
                    ...item,
                    isAvailable: this.isItemAvailable(item),
                };
            })
            .sort((a, b) => {
                const orderA = category?.itemOrder?.[a.id] || 0;
                const orderB = category?.itemOrder?.[b.id] || 0;

                return orderA - orderB;
            });
    }

    getForRestaurant(restaurantID: string): ItemWithAvailabilityType[] {
        const restaurant = this.parent.restaurants.get(restaurantID);

        return Object.keys(this.itemsByRestaurant[restaurantID] || {})
            .map((id) => this.items[id] || null)
            .filter((item) => !!item)
            .map((item) => {
                return {
                    ...item,
                    isAvailable: this.isItemAvailable(item),
                };
            })
            .sort((a, b) => {
                const categoryA = this.parent.categories.get(a.categoryID);
                const categoryB = this.parent.categories.get(b.categoryID);

                if (!categoryA || !categoryB) {
                    return 0;
                }

                const orderA =
                    (restaurant?.categoryOrder?.[categoryA.id] || 0) * 1000 +
                    (categoryA?.itemOrder?.[a.id] || 0);

                const orderB =
                    (restaurant?.categoryOrder?.[categoryB.id] || 0) * 1000 +
                    (categoryB?.itemOrder?.[b.id] || 0);

                return orderA - orderB;
            });
    }

    popularForRestaurant(restaurantID: string): ItemWithAvailabilityType[] {
        return this.getForRestaurant(restaurantID).filter(
            (item) => item.isPopular,
        );
    }

    get(id: string): ItemWithAvailabilityType | null {
        if (!this.items[id]) {
            return null;
        }

        return {
            ...this.items[id],
            isAvailable: this.isItemAvailable(this.items[id]),
        };
    }

    itemVariantGroups(id: string): VariantGroupOrderedViewType[] {
        const item = this.items[id];

        if (!item) {
            return [];
        }

        const category = this.parent.categories.get(item.id);

        const order =
            item?.variantGroupOrder || category?.variantGroupOrder || {};

        const groups: VariantGroupType[] = Object.values(
            item?.variantGroups || category?.variantGroups || {},
        );

        return groups
            .sort((a, b) => (order[a.id] || 0) - (order[b.id] || 0))
            .map((group) => {
                return {
                    ...group,
                    variants: Object.values(group.variants || {}).sort(
                        (va, vb) =>
                            (group?.variantOrder?.[va.id] || 0) -
                            (group?.variantOrder?.[vb.id] || 0),
                    ),
                };
            });
    }

    itemAddons(id: string) {
        const item = this.items[id];

        if (!item) {
            return [];
        }

        const category = this.parent.categories.get(item.categoryID);

        const order = item?.addonOrder || category?.addonOrder || {};
        const addons = Object.values(item?.addons || category?.addons || {});

        return addons.sort((a, b) => (order[a.id] || 0) - (order[b.id] || 0));
    }
}
