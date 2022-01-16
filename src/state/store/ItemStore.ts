import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {Category} from './CategoryStore';
import {InterfaceAdditionType} from './DealStore';

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

    tags?: string[];

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

    addonLimit: number;
}

export class Addon {
    parent: Item;
    data: AddonType;

    constructor(parent: Item, data: AddonType) {
        this.parent = parent;
        this.data = data;
    }
}

export class Variant {
    parent: VariantGroup;
    data: VariantType;

    constructor(parent: VariantGroup, data: VariantType) {
        this.parent = parent;
        this.data = data;
    }
}

export class VariantGroup {
    parent: Item;
    data: VariantGroupType;

    constructor(parent: Item, data: VariantGroupType) {
        this.parent = parent;
        this.data = data;
    }

    get variants() {
        return Object.values(this.data.variants || {})
            .sort(
                (va, vb) =>
                    (this.data?.variantOrder?.[va.id] || 0) -
                    (this.data?.variantOrder?.[vb.id] || 0),
            )
            .map((data) => new Variant(this, data));
    }
}

export class Item {
    parent: ItemStore;
    data: ItemType;

    constructor(parent: ItemStore, data: ItemType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get category(): Category | null {
        return this.parent.parent.categories.get(this.id);
    }

    get id() {
        return this.data.id;
    }

    get originalPrice(): number {
        return this.data.price;
    }

    get price(): number {
        const deal = this.deal;

        if (!deal || !deal.isApplicable) {
            return this.originalPrice;
        }

        const dealPrice = deal.genericScript(this.originalPrice);

        if (dealPrice === true || dealPrice === false) {
            return this.originalPrice;
        }

        return dealPrice;
    }

    get isAvailable(): boolean {
        return this.parent.isItemAvailable(this.data);
    }

    get addons() {
        const root = this.parent.parent;
        const category = root.categories.get(this.data.categoryID);

        const order = this?.data?.addonOrder || category?.data.addonOrder || {};

        const addons = Object.values(
            this?.data?.addons || category?.data.addons || {},
        ).map((data) => new Addon(this, data));

        return addons.sort(
            (a, b) => (order[a.data.id] || 0) - (order[b.data.id] || 0),
        );
    }

    get variantGroups() {
        const root = this.parent.parent;
        const category = root.categories.get(this.data.categoryID);

        const order =
            this?.data.variantGroupOrder ||
            category?.data.variantGroupOrder ||
            {};

        const groups: VariantGroup[] = Object.values(
            this?.data.variantGroups || category?.data.variantGroups || {},
        ).map((data) => new VariantGroup(this, data));

        return groups.sort(
            (a, b) => (order[a.data.id] || 0) - (order[b.data.id] || 0),
        );
    }

    get deals() {
        const itemDeals = this.parent.parent.deals.getForItem(this.id);

        if (itemDeals.length) {
            return itemDeals;
        }

        const categoryDeals = this.parent.parent.deals.getForCategory(
            this.data.categoryID,
        );

        if (categoryDeals.length) {
            return categoryDeals;
        }

        const restaurantDeals = this.parent.parent.deals.getForRestaurant(
            this.data.restaurantID,
        );

        if (restaurantDeals.length) {
            return restaurantDeals;
        }

        if (this.parent.parent.deals.universals.length >= 0) {
            return this.parent.parent.deals.universals;
        }

        return [];
    }

    get deal() {
        return this.deals[0] || null;
    }

    get tags(): InterfaceAdditionType[] {
        const itemTags: InterfaceAdditionType[] =
            this.data?.tags?.map((tag) => ({
                title: tag,
            })) || [];

        const dealTag = this.deal?.data?.interfaceAdditions?.find(
            (addition) => addition.addTo === 'item-header',
        );

        const dealTags = dealTag ? [dealTag] : [];
        return [...itemTags, ...dealTags];
    }
}

export class ItemStore {
    parent: Store;
    listener: (() => void) | null = null;

    items: {
        [id: string]: Item;
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

        this.items[id] = new Item(this, data);

        if (!(data.restaurantID in this.itemsByRestaurant)) {
            this.itemsByRestaurant[data.restaurantID] = {};
        }

        if (!(data.categoryID in this.itemsByCategory)) {
            this.itemsByCategory[data.categoryID] = {};
        }

        this.itemsByCategory[data.categoryID][id] = true;
        this.itemsByRestaurant[data.restaurantID][id] = true;
    }

    remove(id: string): void {
        delete this.itemsByCategory[this.items[id].data.categoryID][id];
        delete this.itemsByRestaurant[this.items[id].data.restaurantID][id];

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

            const branch = restaurant.availableBranches[0];

            if (!branch) {
                return false;
            }

            return !(item.id in (branch?.data?.unavailableItems || {}));
        }
    }

    getForRestaurant(restaurantID: string): Item[] {
        const restaurant = this.parent.restaurants.get(restaurantID);

        return Object.keys(this.itemsByRestaurant[restaurantID] || {})
            .map((id) => this.items[id] || null)
            .filter((item) => !!item)
            .sort((a, b) => {
                const categoryA = this.parent.categories.get(a.data.categoryID);
                const categoryB = this.parent.categories.get(b.data.categoryID);

                if (!categoryA || !categoryB) {
                    return 0;
                }

                const orderA =
                    (restaurant?.data?.categoryOrder?.[categoryA.id] || 0) *
                        1000 +
                    (categoryA?.data.itemOrder?.[a.id] || 0);

                const orderB =
                    (restaurant?.data?.categoryOrder?.[categoryB.id] || 0) *
                        1000 +
                    (categoryB?.data?.itemOrder?.[b.id] || 0);

                return orderA - orderB;
            });
    }

    popularForRestaurant(restaurantID: string): Item[] {
        return this.getForRestaurant(restaurantID).filter(
            (item) => item.data.isPopular,
        );
    }

    get(id: string): Item | null {
        if (!this.items[id]) {
            return null;
        }

        return this.items[id];
    }
}
