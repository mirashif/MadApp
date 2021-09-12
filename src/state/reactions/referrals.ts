import { reaction } from "mobx";

import { withCleanup } from "../helpers/withCleanup";
import type { Store } from "../store";

export function referralReactions(store: Store) {
  reaction(
    () => store.referralValidator?.referral,
    withCleanup((referralCode, oldReferralCode) => {
      if (referralCode !== oldReferralCode && referralCode) {
        console.log(`VALIDATING REFERRAL: ${store.referralValidator.referral}`);

        store.referralValidator.validate();
      }
    }),
    { delay: 1000 }
  );
}
