import { reaction } from "mobx";

import { withCleanup } from "../helpers/withCleanup";
import type { Store } from "../store";

export function branchReactions(store: Store) {
  reaction(
    () => true,
    withCleanup((shouldListen) => {
      console.log("LISTENING: Branches");

      if (shouldListen) {
        store.branches.listen();
      }

      return () => {
        store.branches.unlisten();
      };
    })
  );
}
