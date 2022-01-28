import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface StoryType {
    id: string;
    restaurantID: string;

    target: null | {
        type: 'category' | 'item' | 'item-builder' | 'restaurant',
        categoryID?: string;
        itemID?: string;
    };

    thumbnailImageURI: string;
    imageURI: string;
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

    upsert(id: string, data: StoryType): void {
        this.stories[id] = new Story(this, data);
    }

    remove(id: string): void {
        delete this.stories[id];
    }

    listen(): void {
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
            });
    }

    unlisten(): void {
        if (this.listener) {
            this.listener();
            this.listener = null;
        }
    }

    get all(): Story[] {
        return Object.values(this.stories).sort((a, b) => {
            return (
                (this.parent.app.globals?.storyOrder?.[a.data.id] || 0) -
                (this.parent.app.globals?.storyOrder?.[b.data.id] || 0)
            );
        });
    }

    get(id: string): Story | null {
        return this.stories[id] || null;
    }
}
