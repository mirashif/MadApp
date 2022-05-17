import {makeAutoObservable} from 'mobx';
import {Store} from '.';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {profile} from '../helpers/profile';

export class AuthStore {
    listener: null | (() => void) = null;

    user: FirebaseAuthTypes.User | boolean | null = null;

    requests: {
        // +880---------- / Time in Milliseconds.
        [number: string]: number;
    } = {};

    confirmations: {
        [number: string]: FirebaseAuthTypes.ConfirmationResult;
    } = {};

    get authenticated() {
        const _p = profile('AuthStore.authenticated');

        return _p(this.user);
    }

    constructor(private parent: Store) {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    ready = false;

    setReady(ready: boolean = true) {
        this.ready = ready;
    }

    lastRequest(number: string) {
        const _p = profile('AuthStore.lastRequest');

        return _p(this.requests[number]);
    }

    secondsSinceRequest(number: string) {
        const _p = profile('AuthStore.secondsSinceRequest');

        number = `+88${number.substr(number.length - 11, 11)}`;
        return _p((Date.now() - this.requests[number]) / 1000);
    }

    *requestOTP(number: string) {
        const _p = profile('AuthStore.requestOTP');

        number = `+88${number.substr(number.length - 11, 11)}`;

        try {
            this.confirmations[number] = yield this.parent.firebase
                .auth()
                .signInWithPhoneNumber(number);

            this.requests[number] = Date.now();
        } catch (ex) {
            console.error(
                '[google/firebase - Too Many Requests]: We have blocked all requests from this app signature due to suspicious activity.',
            );

            throw ex;
        }

        _p();
    }

    *authenticate(number: string, otp: string) {
        const _p = profile('AuthStore.authenticate');

        number = `+88${number.substr(number.length - 11, 11)}`;

        console.log(`Authenticating: (${number}, ${otp})`);

        if (!(number in this.confirmations)) {
            throw new Error('You need to request OTP first.');
        }

        try {
            yield this.confirmations[number].confirm(otp);

            console.log('OTP confirmed.');
            return _p(true);
        } catch {
            console.log('OTP error.');
            return _p(false);
        }
    }

    *deauthenticate() {
        const _p = profile('AuthStore.deauthenticate');

        yield this.parent.firebase.auth().signOut();

        _p();
    }

    setUser(user: FirebaseAuthTypes.User | boolean) {
        const _p = profile('AuthStore.setUser');

        this.user = user;

        _p();
    }

    listen() {
        const _p = profile('AuthStore.listen');

        this.listener = this.parent.firebase
            .auth()
            .onAuthStateChanged((user) => {
                this.setUser(user ? user : false);
                this.setReady();
            });

        _p();
    }

    unlisten() {
        const _p = profile('AuthStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }
}
