import { makeAutoObservable } from "mobx";

import type { Store } from "./index";

export interface GlobalsType {
  bannerOrder: {
    [id: string]: number;
  };

  restaurantOrder: {
    [id: string]: number;
  };

  cashbackOrder: {
    [id: string]: number;
  };

  storyOrder: {
    [id: string]: number;
  };

  deliveryCharge: number;
  vatPercentage: number;
  serviceChargePercentage: number;
  pointPerTaka: number;
}

export class AppStore {
  parent: Store;
  listener: (() => void) | null = null;
  globals: GlobalsType | null = null;

  constructor(parent: Store) {
    this.parent = parent;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  setGlobals(data: GlobalsType) {
    this.globals = data;
  }

  listen() {
    this.listener = this.parent.firebase
      .firestore()
      .collection("globals")
      .doc("globals")
      .onSnapshot((snap) => {
        this.setGlobals(<GlobalsType>snap.data());
      });
  }

  unlisten() {
    if (this.listener) {
      this.listener();
      this.listener = null;
    }
  }
}
