import { makeAutoObservable } from "mobx";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import type { TIME_SYMBOL } from "../types/symbols/all";

import type { ItemType } from "./ItemStore";

import type { Store } from "./index";

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

    makeAutoObservable(this, {}, { autoBind: true });

    this.variants = this.defaultVariants;
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

  get defaultVariants() {
    return Object.fromEntries(
      this.parent.items
        .itemVariantGroups(this.itemID)
        .map((group) => {
          const defaultVariant = group.variants.find(
            (variant) => variant.price === 0
          );

          if (!defaultVariant) {
            return [null, null];
          }

          const variantGroupID = group.id;

          return [variantGroupID, defaultVariant.id];
        })
        .filter((variantPair) => variantPair[0] !== null)
    );
  }

  get item(): ItemType | null {
    return this.parent.items.get(this.itemID);
  }

  get itemAddons() {
    return Object.fromEntries(
      this.parent.items
        .itemAddons(this.itemID)
        .map((addon) => [addon.id, addon])
    );
  }

  private get itemVariantGroups() {
    return Object.fromEntries(
      this.parent.items
        .itemVariantGroups(this.itemID)
        .map((variantGroup) => [variantGroup.id, variantGroup])
    );
  }

  private get itemVariants() {
    return Object.fromEntries(
      Object.entries(this.itemVariantGroups)
        .map(([_, group]) => group.variants)
        .flat()
        .map((variant) => [variant.id, variant])
    );
  }

  get total() {
    const basePrice = this.item?.price || 0;

    const addonsTotal = Object.entries(this.addons)
      .map(([addonID, count]) => this.itemAddons[addonID].price * count)
      .reduce((acc, cur) => acc + cur, 0);

    const variantsTotal = Object.entries(this.variants)
      .map(([, variantID]) => this.itemVariants[variantID].price || 0)
      .reduce((acc, cur) => acc + cur, 0);

    return basePrice + addonsTotal + variantsTotal;
  }

  get id() {
    return this.cartableID;
  }

  regenerateCartableID() {
    this.cartableID = uuidv4();
    return this.cartableID;
  }

  cartable(): CartableType | null {
    const { item } = this;

    if (!item) {
      return null;
    }

    const category = this.parent.categories.get(item.categoryID);

    if (!category) {
      return null;
    }

    const addons: CartableAddonType[] = Object.entries(this.addons).map(
      ([addonID, addonCount]) => {
        return {
          addonID,
          addonName: this.itemAddons[addonID].name,
          addonCount,
          addonPrice: this.itemAddons[addonID].price,
          addonHash: this.itemAddons[addonID].hash,
        };
      }
    );

    const variants: CartableVariantType[] = Object.entries(this.variants).map(
      ([variantGroupID, variantID]) => {
        return {
          variantGroupID,
          variantGroupName: this.itemVariantGroups[variantGroupID].name,
          variantID,
          variantName: this.itemVariants[variantID].name,
          variantPrice: this.itemVariants[variantID].price || 0,
          variantHash: this.itemVariants[variantID].hash,
        };
      }
    );

    return {
      id: this.cartableID,
      itemID: item.id,
      itemName: item.name,
      itemPrice: item.price,
      itemHash: item.hash,
      itemThumbnail: item.thumbnailURI,
      itemPicture: item.pictureURI,
      categoryID: category.id,
      categoryName: category.name,
      categoryHash: category.hash,
      total: this.total,
      addons: addons,
      variants: variants,
    };
  }
}
