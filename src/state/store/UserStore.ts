import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {UserBuilder} from './UserBuilder';
import {profile} from '../helpers/profile';

export interface SettingsType {
    receivePush?: boolean;
    receiveEmail?: boolean;
}

export interface UserType {
    id: string;
    settings: SettingsType;

    profileImageURI?: string;

    firstName?: string;
    lastName?: string;

    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-disclose' | null;
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

    _ready = 0;

    constructor(parent: Store) {
        this.parent = parent;
        makeAutoObservable(this, {}, {autoBind: true});
    }

    *updateUser(data: Partial<UserType>) {
        const _p = profile('UserStore.updateUser');

        if (!this.user) {
            throw new Error('User not loaded.');
        }

        yield this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.user.id)
            .set(data, {merge: true});

        _p();
    }

    *updateSettings(settings: SettingsType) {
        const _p = profile('UserStore.updateSettings');

        yield this.updateUser({
            settings: settings,
        });

        _p();
    }

    get settings() {
        const _p = profile('UserStore.settings');

        return _p(this.user?.settings || {});
    }

    setUser(data: UserType) {
        const _p = profile('UserStore.setUser');

        this.user = data;

        _p();
    }

    setUserAttributes(data: UserAttributesType) {
        const _p = profile('UserStore.setUserAttributes');

        this.userAttributes = data;

        _p();
    }

    get ready() {
        return !this.parent.auth.user || this._ready >= 2;
    }

    incrementReady() {
        return this._ready++;
    }

    listen(): void {
        const _p = profile('UserStore.listen');

        if (!this.parent.auth.user || this.parent.auth.user === true) {
            throw new Error('User not loaded.');
        }

        this.listeners[0] = this.parent.firebase
            .firestore()
            .collection('users')
            .doc(this.parent.auth.user?.uid)
            .onSnapshot((snap) => {
                snap && this.setUser(<UserType>snap.data());

                this.incrementReady();
            }, console.error);

        this.listeners[1] = this.parent.firebase
            .firestore()
            .collection('userAttributes')
            .doc(this.parent.auth.user?.uid)
            .onSnapshot((snap) => {
                snap && this.setUserAttributes(<UserAttributesType>snap.data());

                this.incrementReady();
            }, console.error);

        _p();
    }

    unlisten(): void {
        const _p = profile('UserStore.unlisten');

        if (this.listeners[0]) {
            this.listeners[0]();
            this.listeners[0] = null;
        }

        if (this.listeners[1]) {
            this.listeners[1]();
            this.listeners[1] = null;
        }

        _p();
    }

    get points(): number {
        const _p = profile('UserStore.points');

        return _p(this.userAttributes?.points || 0);
    }

    get builder(): UserBuilder | null {
        const _p = profile('UserStore.builder');

        if (this.user) {
            return _p(new UserBuilder(this.parent, this.user));
        } else {
            return _p(null);
        }
    }

    get fullname() {
        const _p = profile('UserStore.fullname');

        return _p(
            `${this.user?.firstName || ''} ${this.user?.lastName || ''}`.trim(),
        );
    }
}
