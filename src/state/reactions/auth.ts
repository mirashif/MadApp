import { reaction } from "mobx";

import { withCleanup } from "../helpers/withCleanup";
import type { Store } from "../store";

export function authReactions(store: Store) {
  reaction(
    () => true,
    withCleanup((shouldListen) => {
      console.log("LISTENING: Auth");

      if (shouldListen) {
        store.auth.listen();
      }

      return () => {
        store.auth.unlisten();
      };
    })
  );
}
