import { makeAutoObservable } from "mobx";

import type { AddonType, VariantGroupType } from "./ItemStore";

import type { Store } from ".";

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
}

export interface CategoryWithAvailabilityType extends CategoryType {
  isAvailable: boolean;
}

export class CategoryStore {
  parent: Store;
  listener: (() => void) | null = null;

  categories: {
    [id: string]: CategoryType;
  } = {};

  categoriesByRestaurant: {
    [restaurantID: string]: {
      [categoryID: string]: true;
    };
  } = {};

  constructor(parent: Store) {
    this.parent = parent;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  upsert(id: string, data: CategoryType): void {
    this.categories[id] = data;

    if (!(data.restaurantID in this.categoriesByRestaurant)) {
      this.categoriesByRestaurant[data.restaurantID] = {};
    }

    this.categoriesByRestaurant[data.restaurantID][id] = true;
  }

  remove(id: string): void {
    const { restaurantID } = this.categories[id];

    delete this.categoriesByRestaurant[restaurantID][id];
    delete this.categories[id];
  }

  listen(): void {
    this.listener = this.parent.firebase
      .firestore()
      .collectionGroup("categories")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            this.upsert(change.doc.id, <CategoryType>change.doc.data());
          } else if (change.type === "removed") {
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

  categoriesFor(restaurantID: string): CategoryWithAvailabilityType[] {
    // eslint-disable-next-line prefer-destructuring
    const currentBranch = this.parent.branches.availableFor(restaurantID)[0];

    return Object.keys(this.categoriesByRestaurant[restaurantID] || {})
      .map((key) => this.categories[key])
      .map((category) => {
        const isAvailable = !category.isAvailable
          ? false
          : !currentBranch?.unavailableCategories?.[category.id];

        return {
          ...category,
          isAvailable: isAvailable,
        };
      });
  }

  get(id: string): CategoryWithAvailabilityType | null {
    if (!this.categories[id]) {
      return null;
    }

    const category = this.categories[id];
    const { restaurantID } = category;
    // eslint-disable-next-line prefer-destructuring
    const currentBranch = this.parent.branches.availableFor(restaurantID)[0];

    const isAvailable = !category.isAvailable
      ? false
      : !currentBranch?.unavailableCategories?.[id];

    return {
      ...category,
      isAvailable: isAvailable,
    };
  }
}
