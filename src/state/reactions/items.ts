import { autorun, reaction } from "mobx";
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function itemsReaction(store: Store) {
    reaction(
        () => true,
        withCleanup((shouldListen) => {
            console.log('LISTENING: Items');

            if (shouldListen) {
                store.items.listen();
            }

            return () => {
                store.items.unlisten();
            };
        }),
        {fireImmediately: true},
    );
}
