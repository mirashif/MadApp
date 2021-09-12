import { reaction } from "mobx";

import { withCleanup } from "../helpers/withCleanup";
import type { AddressBuilder } from "../store/AddressBuilder";

export function addressBuilderReactions(builder: AddressBuilder) {
  reaction(
    () => !builder.addressTouched && builder.location,
    withCleanup((shouldInfer) => {
      if (shouldInfer) {
        builder.inferAddress();
      }
    }),
    { delay: 3000 }
  );

  reaction(
    () => !builder.locationTouched && builder.address,
    withCleanup((shouldInfer) => {
      if (shouldInfer) {
        builder.inferLocation();
      }
    }),
    { delay: 3000 }
  );
}
