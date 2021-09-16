import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface StoryType {
    id: string;

    thumbnailImageURI: string;
    imageURI: string;
    postedAt: FirebaseFirestoreTypes.Timestamp;
}

export class StoryStore {
    parent: Store;
    listener: (() => void) | null = null;

    stories: {
        [id: string]: StoryType;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: StoryType): void {
        this.stories[id] = data;
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

    get all(): StoryType[] {
        return Object.values(this.stories).sort((a, b) => {
            return (
                (this.parent.app.globals?.storyOrder[a.id] || 0) -
                (this.parent.app.globals?.storyOrder[b.id] || 0)
            );
        });
    }

    get(id: string): StoryType | null {
        return this.stories[id] || null;
    }
}
