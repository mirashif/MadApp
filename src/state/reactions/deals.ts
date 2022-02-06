import {reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function dealReactions(store: Store) {
    reaction(
        () => true,
        withCleanup((shouldListen) => {
            console.log('LISTENING: Deals');

            if (shouldListen) {
                store.deals.listen();
            }

            return () => {
                store.deals.unlisten();
            };
        }),
        {fireImmediately: true},
    );
}
