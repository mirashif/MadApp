import {makeAutoObservable} from 'mobx';
import {Store} from '.';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

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
        return this.user;
    }

    constructor(private parent: Store) {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    lastRequest(number: string) {
        return this.requests[number];
    }

    *requestOTP(number: string) {
        try {
            this.confirmations[number] = yield this.parent.firebase
                .auth()
                .signInWithPhoneNumber(
                    `+88${number.substr(number.length - 11, 11)}`,
                );

            this.requests[number] = Date.now();
        } catch (ex) {
            throw ex;
        }
    }

    *authenticate(number: string, otp: string) {
        console.log(`Authenticating: (${number}, ${otp})`);

        if (!(number in this.confirmations)) {
            throw new Error('You need to request OTP first.');
        }

        try {
            yield this.confirmations[number].confirm(otp);

            console.log('OTP confirmed.');
            return true;
        } catch {
            console.log('OTP error.');
            return false;
        }
    }

    *deauthenticate() {
        yield this.parent.firebase.auth().signOut();
    }

    setUser(user: FirebaseAuthTypes.User | boolean) {
        this.user = user;
    }

    listen() {
        this.listener = this.parent.firebase
            .auth()
            .onAuthStateChanged((user) => {
                this.setUser(user ? user : false);
            });
    }

    unlisten() {
        if (this.listener) {
            this.listener();
            this.listener = null;
        }
    }
}
