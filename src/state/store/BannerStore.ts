import {makeAutoObservable} from 'mobx';
import {Store} from '.';

export interface BannerType {
    id: string;
    imageURI: string;
}

export class Banner {
    parent: BannerStore;
    data: BannerType;

    constructor(parent: BannerStore, data: BannerType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }
}

export class BannerStore {
    parent: Store;
    listener: (() => void) | null = null;

    banners: {
        [key: string]: Banner;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: BannerType): void {
        this.banners[id] = new Banner(this, data);
    }

    remove(id: string): void {
        delete this.banners[id];
    }

    listen(): void {
        this.listener = this.parent.firebase
            .firestore()
            .collection('banners')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <BannerType>change.doc.data(),
                        );
                    } else if (change.type === 'removed') {
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

    get all(): Banner[] {
        return Object.values(this.banners).sort((a, b) => {
            return (
                (this.parent.app.globals?.bannerOrder?.[a.data.id] || 0) -
                (this.parent.app.globals?.bannerOrder?.[b.data.id] || 0)
            );
        });
    }

    get(id: string): Banner | null {
        return this.banners[id] || null;
    }
}
