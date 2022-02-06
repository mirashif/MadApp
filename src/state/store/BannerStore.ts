import {makeAutoObservable} from 'mobx';
import {Store} from '.';
import {profile} from '../helpers/profile';

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

    ready = false;

    setReady(ready: boolean = true) {
        this.ready = ready;
    }

    upsert(id: string, data: BannerType): void {
        const _p = profile('BannerStore.upsert');

        this.banners[id] = new Banner(this, data);

        _p();
    }

    remove(id: string): void {
        const _p = profile('BannerStore.remove');

        delete this.banners[id];

        _p();
    }

    listen(): void {
        const _p = profile('BannerStore.listen');

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

                this.setReady();
            });

        _p();
    }

    unlisten(): void {
        const _p = profile('BannerStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }

    get all(): Banner[] {
        const _p = profile('BannerStore.all');

        return _p(
            Object.values(this.banners).sort((a, b) => {
                return (
                    (this.parent.app.globals?.bannerOrder?.[a.data.id] || 0) -
                    (this.parent.app.globals?.bannerOrder?.[b.data.id] || 0)
                );
            }),
        );
    }

    get(id: string): Banner | null {
        const _p = profile('BannerStore.get');

        return _p(this.banners[id] || null);
    }
}
