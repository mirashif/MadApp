import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {UserBuilder} from './UserBuilder';

export interface SettingsType {
    receivePush?: boolean;
    receiveEmail?: boolean;
    language: 'english';
}

export interface UserType {
    id: string;
    settings: SettingsType;

    profileImageURI?: string;

    firstName?: string;
    lastName?: string;

    gender?: string;
    dob?: string;
    email?: string;
    phone: string;

    referral?: string;

    createdAt: FirebaseFirestoreTypes.Timestamp;
    updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface UserAttributesType {
    id: string;

    points?: number;
    referralCode?: string;
    referralUsed?: string;

    phone: string;
    createdAt: FirebaseFirestoreTypes.Timestamp;
    updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export class UserStore {
    parent: Store;
    listeners: [(() => void) | null, (() => void) | null] = [null, null];

    user: UserType | null = null;
    userAttributes: UserAttributesType | null = null;

    constructor(parent: Store) {
        this.parent = parent;
        makeAutoObservable(this, {}, {autoBind: true});
    }

    *updateUser(data: Partial<UserType>) {
        if (!this.user) {
            throw new Error('User not loaded.');
        }

        yield this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.user.id)
            .set(data, {merge: true});
    }

    *updateSettings(settings: SettingsType) {
        yield this.updateUser({
            settings: settings,
        });
    }

    get settings() {
        return this.user?.settings || {};
    }

    setUser(data: UserType) {
        this.user = data;
    }

    setUserAttributes(data: UserAttributesType) {
        this.userAttributes = data;
    }

    listen(): void {
        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error('User not loaded.');
        }

        this.listeners[0] = this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user?.uid)
            .onSnapshot((snap) => {
                snap && this.setUser(<UserType>snap.data());
            }, console.error);

        this.listeners[1] = this.parent.firebase
            .firestore()
            .collection('userAttributes')
            .doc(this.parent.auth.user?.uid)
            .onSnapshot((snap) => {
                snap && this.setUserAttributes(<UserAttributesType>snap.data());
            }, console.error);
    }

    unlisten(): void {
        if (this.listeners[0]) {
            this.listeners[0]();
            this.listeners[0] = null;
        }

        if (this.listeners[1]) {
            this.listeners[1]();
            this.listeners[1] = null;
        }
    }

    get points(): number {
        return this.userAttributes?.points || 0;
    }

    get builder(): UserBuilder | null {
        if (this.user) {
            return new UserBuilder(this.parent, this.user);
        } else {
            return null;
        }
    }
}
