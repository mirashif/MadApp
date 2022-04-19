import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {UserType} from './UserStore';
import {profile} from '../helpers/profile';

export class UserBuilder {
    parent: Store;

    firstName = '';
    lastName = '';
    dob = '';
    email = '';
    phone = '';
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-disclose' | null = null;
    profileImageURI: string | null = null;

    constructor(parent: Store, data: UserType) {
        this.parent = parent;

        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.dob = data.dob || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.gender = data.gender ?? null;
        this.profileImageURI = data.profileImageURI ?? null;


        makeAutoObservable(this, {}, {autoBind: true});
    }

    setFirstName(name: string) {
        const _p = profile('UserBuilder.setFirstName');

        this.firstName = name.replace(/[^A-Za-z.\-']/g, '');

        _p();
    }

    setLastName(name: string) {
        const _p = profile('UserBuilder.setLastName');

        this.lastName = name.replace(/[^A-Za-z.\-']/g, '');

        _p();
    }

    setEmail(email: string) {
        const _p = profile('UserBuilder.setEmail');

        this.email = email;

        _p();
    }

    setDob(
        year: number | string,
        month: number | string,
        date: number | string,
    ) {
        const _p = profile('UserBuilder.setDob');

        const y = `${year}`.padStart(2, '0');
        const m = `${month}`.padStart(2, '0');
        const d = `${date}`.padStart(2, '0');

        this.dob = `${y}-${m}-${d}`;

        _p();
    }

    setProfileImageURI(uri: string) {
        this.profileImageURI = uri;
    }

    setGender(gender: 'male' | 'female' | 'other' | 'prefer-not-to-disclose') {
        this.gender = gender;
    }

    get userable(): Partial<UserType> {
        const _p = profile('UserBuilder.userable');

        return _p({
            firstName: this.firstName,
            lastName: this.lastName,
            dob: this.dob,
            email: this.email,
            phone: this.phone,
            ...(this.gender ? {gender: this.gender} : null),
            ...(this.profileImageURI ? {profileImageURI: this.profileImageURI} : null),
        });
    }
}
