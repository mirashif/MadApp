import { makeAutoObservable } from "mobx";

import { composeFlow } from "../helpers/composeFlow";

import type { Store } from "./index";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ReferralType {}

export class ReferralValidator {
  parent: Store;

  referral: string | null = null;
  isValidating = false;

  error: string | null = null;
  errorCode: string | null = null;

  isValid: boolean | null = null;

  constructor(parent: Store) {
    this.parent = parent;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  setReferral(referral: string) {
    this.referral = referral;
  }

  *validate() {
    this.isValidating = true;

    try {
      const isReferralValid = this.parent.firebase
        .functions()
        .httpsCallable("referrals-isReferralValid");

      const result = (yield* composeFlow(
        isReferralValid({
          referralCode: this.referral,
        })
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
