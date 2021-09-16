import {reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function orderReactions(store: Store) {
    reaction(
        () => !!store.auth.user,
        withCleanup((shouldListen) => {
            console.log('LISTENING: Orders');

            if (shouldListen) {
                store.orders.listen();
            }

            return () => {
                store.orders.unlisten();
            };
        }),
        {fireImmediately: true},
    );
}
