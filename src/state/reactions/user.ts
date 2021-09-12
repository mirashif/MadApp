import { reaction } from "mobx";

import { withCleanup } from "../helpers/withCleanup";
import type { Store } from "../store";

export function userReactions(store: Store) {
  reaction(
    () => !!store.auth.user,
    withCleanup((shouldListen, previousShouldListen) => {
      if (shouldListen !== previousShouldListen && shouldListen) {
        console.log("LISTENING: User");

        store.user.listen();

        return () => {
          store.user.unlisten();
        };
      }
    })
  );
}
