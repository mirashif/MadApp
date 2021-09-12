import { makeAutoObservable } from "mobx";

import type { Store } from ".";

export interface BannerType {
  id: string;
  imageURI: string;
}

export class BannerStore {
  parent: Store;
  listener: (() => void) | null = null;

  banners: {
    [key: string]: BannerType;
  } = {};

  constructor(parent: Store) {
    this.parent = parent;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  upsert(id: string, data: BannerType): void {
    this.banners[id] = data;
  }

  remove(id: string): void {
    delete this.banners[id];
  }

  listen(): void {
    this.listener = this.parent.firebase
      .firestore()
      .collection("banners")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            this.upsert(change.doc.id, <BannerType>change.doc.data());
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

  get all(): BannerType[] {
    return Object.values(this.banners).sort((a, b) => {
      return (
        (this.parent.app.globals?.bannerOrder[a.id] || 0) -
        (this.parent.app.globals?.bannerOrder[b.id] || 0)
      );
    });
  }

  get(id: string): BannerType | null {
    return this.banners[id] || null;
  }
}
