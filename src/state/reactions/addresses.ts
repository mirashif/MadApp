import { reaction } from "mobx";

import { withCleanup } from "../helpers/withCleanup";
import type { Store } from "../store";

export function addressReactions(store: Store) {
  reaction(
    () => !!store.auth.user,
    withCleanup((shouldListen) => {
      console.log("LISTENING: Addresses");

      if (shouldListen) {
        store.addresses.listen();
      }

      return () => {
        store.addresses.unlisten();
      };
    })
  );
}
