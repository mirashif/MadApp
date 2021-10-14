import {makeAutoObservable} from 'mobx';
import {Store} from '.';

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

    upsert(id: string, data: FreebieType): void {
        this.banners[id] = new Freebie(this, data);
    }

    remove(id: string): void {
        delete this.banners[id];
    }

    listen(): void {
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
            });
    }

    unlisten(): void {
        if (this.listener) {
            this.listener();
            this.listener = null;
        }
    }

    get all(): Freebie[] {
        return Object.values(this.banners).sort((a, b) => {
            return (
                (this.parent.app.globals?.bannerOrder?.[a.data.id] || 0) -
                (this.parent.app.globals?.bannerOrder?.[b.data.id] || 0)
            );
        });
    }

    get(id: string): Freebie | null {
        return this.banners[id] || null;
    }
}
