import { reaction } from "mobx";

import { withCleanup } from "../helpers/withCleanup";
import type { Store } from "../store";

export function restaurantReactions(store: Store) {
  reaction(
    () => true,
    withCleanup((shouldListen) => {
      console.log("LISTENING: Restaurants");

      if (shouldListen) {
        store.restaurants.listen();
      }

      return () => {
        store.restaurants.unlisten();
      };
    })
  );
}
