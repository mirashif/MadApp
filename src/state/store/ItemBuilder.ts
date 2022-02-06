import {makeAutoObservable} from 'mobx';

import {v4 as uuidv4} from 'uuid';

import {Store} from './index';
import {Item} from './ItemStore';
import {TIME_SYMBOL} from '../types/symbols/all';

export interface CartableAddonType {
    addonID: string;
    addonName: string;
    addonCount: number;
    addonPrice: number;
    addonHash: string;
}

export interface CartableVariantType {
    variantGroupID: string;
    variantGroupName: string;
    variantID: string;
    variantName: string;
    variantPrice: number;
    variantHash: string;
}

export interface CartableType {
    id: string;

    itemID: string;
    itemName: string;
    itemPrice: number;
    itemHash: string;
    itemThumbnail?: string;
    itemPicture?: string;
    categoryID: string;
    categoryName: string;
    categoryHash: string;
    total: number;
    addons: CartableAddonType[];
    variants: CartableVariantType[];

    [TIME_SYMBOL]?: number;
}

export class ItemBuilder {
    parent: Store;

    cartableID: string;
    itemID: string;

    addons: {
        [addonID: string]: number;
    } = {};

    variants: {
        [variantGroupID: string]: string;
    } = {};

    constructor(parent: Store, itemID: string) {
        this.parent = parent;
        this.itemID = itemID;

        this.cartableID = uuidv4();

        makeAutoObservable(this, {}, {autoBind: true});
    }

    chooseVariant(variantGroupID: string, variantID: string): void {
        this.variants[variantGroupID] = variantID;
    }

    chosenVariant(variantGroupID: string): string | null {
        return this.variants[variantGroupID] || null;
    }

    addonCount(addonID: string): number {
        return this.addons[addonID] || 0;
    }

    incrementAddon(addonID: string): void {
        if (!(addonID in this.addons)) {
            this.addons[addonID] = 0;
        }

        this.addons[addonID]++;
    }

    decrementAddon(addonID: string): void {
        if (!(addonID in this.addons)) {
            this.addons[addonID] = 0;
        }

        this.addons[addonID]--;

        if (this.addons[addonID] <= 0) {
            this.clearAddon(addonID);
        }
    }

    clearAddon(addonID: string): void {
        delete this.addons[addonID];
    }

    clearAddons() {
        this.addons = {};
    }

    get item(): Item | null {
        return this.parent.items.get(this.itemID);
    }
}
