import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface InviteType {
    id: string;

    name: string;
    number: string;

    createdAt: FirebaseFirestoreTypes.Timestamp;
    updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export class InviteStore {
    parent: Store;
    listener: (() => void) | null = null;

    invites: {
        [key: string]: InviteType;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: InviteType): void {
        this.invites[id] = data;
    }

    remove(id: string): void {
        delete this.invites[id];
    }

    listen() {
        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error("Can't listen if auth-user is not initialized.");
        }

        this.listener = this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user?.uid)
            .collection('invites')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <InviteType>change.doc.data(),
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

    get all(): InviteType[] {
        return Object.values(this.invites).sort((a, b) => {
            return (
                (b?.createdAt?.toMillis() || 0) -
                (a?.createdAt?.toMillis() || 0)
            );
        });
    }

    get(id: string): InviteType | null {
        return this.invites[id] || null;
    }
}
