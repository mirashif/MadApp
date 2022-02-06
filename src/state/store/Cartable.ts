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
import {profile} from '../helpers/profile';

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
        const _p = profile('CartableAddon.count');

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

        return _p(count);
    }

    increment() {
        const _p = profile('CartableAddon.increment');

        this.delta(1);

        _p();
    }

    decrement() {
        const _p = profile('CartableAddon.decrement');

        this.delta(-1);

        _p();
    }

    clear() {
        const _p = profile('CartableAddon.clear');

        this._count = 0;

        _p();
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
        const _p = profile('CartableVariant.isSelected');

        return _p(
            this.parent.selected?.variant.data.id === this.variant.data.id,
        );
    }

    select() {
        const _p = profile('CartableVariant.select');

        this.parent.setSelected(this);

        _p();
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
        const _p = profile('CartableVariantGroup.setSelected');

        this.selected = cartableVariant;

        _p();
    }

    clear() {
        const _p = profile('CartableVariantGroup.clear');

        this.selected = null;

        _p();
    }

    get variants() {
        const _p = profile('CartableVariantGroup.variants');

        return _p(
            this.variantGroup.variants.map(
                (variant) => new CartableVariant(this, variant),
            ),
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
        const _p = profile('Cartable.id');

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

        return _p(`${itemID}#${addonsWithCounts}#${chosenVariants}`);
    }

    get cartableAddons() {
        const _p = profile('Cartable.cartableAddons');

        return _p(
            this.item.addons.map((addon) => new CartableAddon(this, addon)),
        );
    }

    get cartableVariantGroups() {
        const _p = profile('Cartable.cartableVariantGroups');

        return _p(
            this.item.variantGroups.map(
                (variantGroup) => new CartableVariantGroup(this, variantGroup),
            ),
        );
    }

    increment() {
        const _p = profile('Cartable.increment');

        this.count++;

        _p();
    }

    decrement() {
        const _p = profile('Cartable.decrement');

        this.count = Math.max(this.count - 1, 1);

        _p();
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
        const _p = profile('Cartable.singularPrice');

        return _p(this.dealt instanceof Array ? this.dealt[1] : this.dealt);
    }

    get price(): number {
        const _p = profile('Cartable.price');

        return _p(this.singularPrice * this.count);
    }

    get originalPrice(): number {
        const _p = profile('Cartable.originalPrice');

        return _p(this.item.originalPrice * this.count);
    }

    get freebies(): Freebie[] {
        const _p = profile('Cartable.freebies');

        return _p(
            this.dealt instanceof Array &&
                typeof this.dealt[0] === 'string' &&
                this.dealt[0].indexOf('freebies') === 0
                ? <Freebie[]>this.dealt[0]
                      .substr(this.dealt[0].indexOf(':') + 1)
                      .split(',')
                      .map((freebieID) => this.parent.freebies.get(freebieID))
                      .filter((freebie) => freebie instanceof Freebie)
                : [],
        );
    }

    get hasFreebies() {
        const _p = profile('Cartable.hasFreebies');

        return _p(this.freebies.length >= 0);
    }

    get isDealApplied() {
        const _p = profile('Cartable.isDealApplied');

        return _p(
            this.hasFreebies ||
                (this.singularPrice !== this.originalPrice &&
                    this.singularPrice < this.originalPrice),
        );
    }

    addToCart() {
        const _p = profile('Cartable.addToCart');

        this.count = 1;
        const serialized = this.cartablePacket;
        this.parent.cart.upsert(serialized);

        _p();
    }

    get cartablePacket() {
        const _p = profile('Cartable.cartablePacket');

        return _p(new CartablePacket(this));
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
        const _p = profile('CartablePacket.constructor');

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

        _p();
    }

    get serialized(): SerializedCartable {
        const _p = profile('CartablePacket.serialized');

        return _p({
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
        });
    }
}
