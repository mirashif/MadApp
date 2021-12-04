import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {composeFlow} from '../helpers/composeFlow';

export interface ReferralType {}

export class ReferralValidator {
    parent: Store;

    referral: string | null = null;
    isValidating: boolean = false;

    error: string | null = null;
    errorCode: number | null = null;

    isValid: boolean | null = null;

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    setReferral(referral: string) {
        this.referral = referral;
    }

    *validate() {
        this.isValidating = true;

        try {
            const isReferralValid = this.parent.firebase
                .functions()
                .httpsCallable('referrals-isReferralValid');

            const result = (yield* composeFlow(
                isReferralValid({
                    referralCode: this.referral,
                }),
            )).data;

            if (result.valid) {
                this.error = null;
                this.isValid = true;
            } else {
                this.error = result?.reason;
                this.errorCode = result?.code;
                this.isValid = false;
            }
        } catch (ex) {
            throw ex;
        } finally {
            this.isValidating = false;
        }

        return true;
    }
}
