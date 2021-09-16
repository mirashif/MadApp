import {reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function cashbackReactions(store: Store) {
    reaction(
        () => true,
        withCleanup((shouldListen, previousShouldListen) => {
            if (shouldListen !== previousShouldListen && shouldListen) {
                console.log('LISTENING: Cashbacks');

                store.cashbacks.listen();

                return () => {
                    store.cashbacks.unlisten();
                };
            }
        }),
        {fireImmediately: true},
    );
}
