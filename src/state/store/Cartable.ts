import {makeAutoObservable} from 'mobx';

import {Store} from './index';
import {
    Addon,
    AddonType,
    Item,
    ItemType,
    Variant,
    VariantGroup,
    VariantGroupType,
    VariantType,
} from './ItemStore';
import {Category} from './CategoryStore';
import {Freebie} from './FreebieStore';

export class CartableAddon {
    parent: Cartable;
    addon: Addon;

    _count: number = 0;

    constructor(parent: Cartable, addon: Addon) {
        this.parent = parent;
        this.addon = addon;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    private delta(diff: -1 | 1) {
        this._count += diff;
    }

    get count() {
        const item: Item = this.addon.parent;
        const category: Category | null = item.category;

        let count = this._count;

        if (count >= this.addon.data.specificCountLimit) {
            count = this.addon.data.specificCountLimit;
        }

        if (count >= item.data.addonLimit) {
            count = item.data.addonLimit;
        }

        if (category && count >= category.data.addonLimit) {
            count = category.data.addonLimit;
        }

        if (count <= 0) {
            count = 0;
        }

        return count;
    }

    increment() {
        this.delta(1);
    }

    decrement() {
        this.delta(-1);
    }

    clear() {
        this._count = 0;
    }
}

export class CartableVariant {
    parent: CartableVariantGroup;
    variant: Variant;

    constructor(parent: CartableVariantGroup, variant: Variant) {
        this.parent = parent;
        this.variant = variant;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get isSelected() {
        return this.parent.selected?.variant.data.id === this.variant.data.id;
    }

    select() {
        this.parent.setSelected(this);
    }
}

export class CartableVariantGroup {
    parent: Cartable;
    variantGroup: VariantGroup;

    selected: CartableVariant | null = null;

    constructor(parent: Cartable, variantGroup: VariantGroup) {
        this.parent = parent;
        this.variantGroup = variantGroup;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    setSelected(cartableVariant: CartableVariant) {
        this.selected = cartableVariant;
    }

    clear() {
        this.selected = null;
    }

    get variants() {
        return this.variantGroup.variants.map(
            (variant) => new CartableVariant(this, variant),
        );
    }
}

export class Cartable {
    parent: Store;
    item: Item;
    count: number = 1;

    constructor(parent: Store, item: Item) {
        this.parent = parent;
        this.item = item;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get id(): string {
        const itemID = this.item.id;

        const addonsWithCounts = this.cartableAddons
            .map((addon) => `${addon.addon.data.id}:${addon.count}`)
            .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
            .join('-');

        const chosenVariants = this.cartableVariantGroups
            .map(
                (variantGroup) =>
                    `${variantGroup.variantGroup.data.id}:${variantGroup.selected}`,
            )
            .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
            .join('-');

        return `${itemID}#${addonsWithCounts}#${chosenVariants}`;
    }

    get cartableAddons() {
        return this.item.addons.map((addon) => new CartableAddon(this, addon));
    }

    get cartableVariantGroups() {
        return this.item.variantGroups.map(
            (variantGroup) => new CartableVariantGroup(this, variantGroup),
        );
    }

    increment() {
        this.count++;
    }

    decrement() {
        this.count = Math.max(this.count - 1, 1);
    }

    private get dealt(): [string, number] | number {
        const originalPrice = this.item.originalPrice;
        const genericDealPrice = this.item.price;
        const deal = this.item.deal;

        if (
            !deal ||
            !deal.isApplicable ||
            !this.parent.app?.globals ||
            !this.parent.user?.user ||
            !this.parent.user?.userAttributes
        ) {
            return genericDealPrice;
        }

        const dealPrice = deal.calcScript(
            originalPrice,
            genericDealPrice,
            this.cartablePacket.serialized,
            this.parent.app.globals,
            this.parent.user.user,
            this.parent.user.userAttributes,
        );

        if (typeof dealPrice === 'string') {
            return [dealPrice, genericDealPrice];
        }

        if (dealPrice === true || dealPrice === false) {
            return genericDealPrice;
        }

        if (dealPrice > 0 || dealPrice <= 0) {
            return dealPrice;
        }

        return genericDealPrice;
    }

    get singularPrice(): number {
        return this.dealt instanceof Array ? this.dealt[1] : this.dealt;
    }

    get price(): number {
        return this.singularPrice * this.count;
    }

    get freebies(): Freebie[] {
        return this.dealt instanceof Array &&
            typeof this.dealt[0] === 'string' &&
            this.dealt[0].indexOf('freebies') === 0
            ? <Freebie[]>this.dealt[0]
                  .substr(this.dealt[0].indexOf(':') + 1)
                  .split(',')
                  .map((freebieID) => this.parent.freebies.get(freebieID))
                  .filter((freebie) => freebie instanceof Freebie)
            : [];
    }

    get hasFreebies() {
        return this.freebies.length >= 0;
    }

    get isDealApplied() {
        return (
            this.hasFreebies || this.singularPrice !== this.item.originalPrice
        );
    }

    addToCart() {
        this.count = 1;
        const serialized = this.cartablePacket;
        this.parent.cart.upsert(serialized);
    }

    get cartablePacket() {
        return new CartablePacket(this);
    }
}

export interface CartablePacketData {
    id: string;
    count: number;
    item: Item;
    addons: {
        [addonID: string]: {
            count: number;
            addon: Addon;
        };
    };
    variants: {
        [variantGroupID: string]: {
            variantGroup: VariantGroup;
            selectedVariant: Variant | null;
        };
    };
}

export interface SerializedCartable {
    id: string;
    count: number;
    item: ItemType;
    addons: {
        [addonID: string]: {
            count: number;
            addon: AddonType;
        };
    };
    variants: {
        [variantGroupID: string]: {
            variantGroup: VariantGroupType;
            selectedVariant: VariantType | null;
        };
    };
}

export class CartablePacket {
    data: CartablePacketData;

    constructor(cartable: Cartable) {
        this.data = {
            id: cartable.id,
            count: cartable.count,
            item: cartable.item,
            addons: Object.fromEntries(
                cartable.cartableAddons.map((cartableAddon) => {
                    return [
                        cartableAddon.addon.data.id,
                        {
                            count: cartableAddon.count,
                            addon: cartableAddon.addon,
                        },
                    ];
                }),
            ),
            variants: Object.fromEntries(
                cartable.cartableVariantGroups.map((cartableVariantGroup) => {
                    return [
                        cartableVariantGroup.variantGroup.data.id,
                        {
                            variantGroup: cartableVariantGroup.variantGroup,
                            selectedVariant:
                                cartableVariantGroup.selected?.variant || null,
                        },
                    ];
                }),
            ),
        };

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get serialized(): SerializedCartable {
        return {
            id: this.data.id,
            count: this.data.count,
            item: this.data.item.data,
            addons: Object.fromEntries(
                Object.entries(this.data.addons).map(([key, value]) => [
                    key,
                    {
                        count: value.count,
                        addon: value.addon.data,
                    },
                ]),
            ),
            variants: Object.fromEntries(
                Object.entries(this.data.variants).map(([key, value]) => [
                    key,
                    {
                        variantGroup: value.variantGroup.data,
                        selectedVariant: value.selectedVariant?.data || null,
                    },
                ]),
            ),
        };
    }
}
