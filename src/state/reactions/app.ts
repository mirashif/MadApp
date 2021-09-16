import {reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function appReactions(store: Store) {
    reaction(
        () => true,
        withCleanup((shouldListen) => {
            console.log('LISTENING: Globals');

            if (shouldListen) {
                store.app.listen();
            }

            return () => {
                store.app.unlisten();
            };
        }),
        {delay: 100, fireImmediately: true},
    );
}
