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

export class Invite {
    parent: InviteStore;
    data: InviteType;

    constructor(parent: InviteStore, data: InviteType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }
}

export class InviteStore {
    parent: Store;
    listener: (() => void) | null = null;

    invites: {
        [key: string]: Invite;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: InviteType): void {
        this.invites[id] = new Invite(this, data);
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

    get all(): Invite[] {
        return Object.values(this.invites).sort((a, b) => {
            return (
                (b?.data?.createdAt?.toMillis() || 0) -
                (a?.data?.createdAt?.toMillis() || 0)
            );
        });
    }

    get(id: string): Invite | null {
        return this.invites[id] || null;
    }
}
