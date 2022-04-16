import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {profile} from '../helpers/profile';

export interface StoryType {
    id: string;
    restaurantID: string;

    target:
        | null
        | {
              type: 'category';
              categoryID: string;
          }
        | {
              type: 'item' | 'item-builder';
              itemID: string;
          }
        | {
              type: 'restaurant';
          };

    thumbnailImageURI: string;
    imageURI: string;
    caption: string;

    postedAt: FirebaseFirestoreTypes.Timestamp;
}

export class Story {
    parent: StoryStore;
    data: StoryType;

    constructor(parent: StoryStore, data: StoryType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }
}

export class StoryStore {
    parent: Store;
    listener: (() => void) | null = null;

    stories: {
        [id: string]: Story;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    ready = false;

    setReady(ready: boolean = true) {
        this.ready = ready;
    }

    upsert(id: string, data: StoryType): void {
        const _p = profile('StoryStore.upsert');

        this.stories[id] = new Story(this, data);

        _p();
    }

    remove(id: string): void {
        const _p = profile('StoryStore.remove');

        delete this.stories[id];

        _p();
    }

    listen(): void {
        const _p = profile('StoryStore.listen');

        this.listener = this.parent.firebase
            .firestore()
            .collection('stories')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <StoryType>change.doc.data(),
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
        const _p = profile('StoryStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }

    get all(): Story[] {
        const _p = profile('StoryStore.all');

        return _p(
            Object.values(this.stories).sort((a, b) => {
                return (
                    (this.parent.app.globals?.storyOrder?.[a.data.id] || 0) -
                    (this.parent.app.globals?.storyOrder?.[b.data.id] || 0)
                );
            }),
        );
    }

    get(id: string): Story | null {
        const _p = profile('StoryStore.get');

        return _p(this.stories[id] || null);
    }
}
