import {makeAutoObservable} from 'mobx';
import {Store} from '.';
import {profile} from '../helpers/profile';

export interface FreebieType {
    id: string;

    name: string;
    description: string;
    imageURI: string;

    value: number;
}

export class Freebie {
    parent: FreebieStore;
    data: FreebieType;

    constructor(parent: FreebieStore, data: FreebieType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }
}

export class FreebieStore {
    parent: Store;
    listener: (() => void) | null = null;

    banners: {
        [key: string]: Freebie;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    ready = false;

    setReady(ready: boolean = true) {
        this.ready = ready;
    }

    upsert(id: string, data: FreebieType): void {
        const _p = profile('FreebieStore.upsert');

        this.banners[id] = new Freebie(this, data);

        _p();
    }

    remove(id: string): void {
        const _p = profile('FreebieStore.remove');

        delete this.banners[id];

        _p();
    }

    listen(): void {
        const _p = profile('FreebieStore.listen');

        this.listener = this.parent.firebase
            .firestore()
            .collection('freebies')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <FreebieType>change.doc.data(),
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
        const _p = profile('FreebieStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }

    get all(): Freebie[] {
        const _p = profile('FreebieStore.all');

        return _p(
            Object.values(this.banners).sort((a, b) => {
                return (
                    (this.parent.app.globals?.bannerOrder?.[a.data.id] || 0) -
                    (this.parent.app.globals?.bannerOrder?.[b.data.id] || 0)
                );
            }),
        );
    }

    get(id: string): Freebie | null {
        const _p = profile('FreebieStore.get');

        return _p(this.banners[id] || null);
    }
}
