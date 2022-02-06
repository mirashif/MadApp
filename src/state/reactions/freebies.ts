import {reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function freebieReactions(store: Store) {
    reaction(
        () => true,
        withCleanup((shouldListen) => {
            console.log('LISTENING: Freebies');

            if (shouldListen) {
                store.freebies.listen();
            }

            return () => {
                store.freebies.unlisten();
            };
        }),
        {fireImmediately: true},
    );
}
