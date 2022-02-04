import {reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function categoryReactions(store: Store) {
    reaction(
        () => true,
        withCleanup((shouldListen, previousShouldListen) => {
            if (shouldListen !== previousShouldListen && shouldListen) {
                console.log('LISTENING: Categories');

                store.categories.listen();
            }

            return () => {
                store.categories.unlisten();
            };
        }),
        {fireImmediately: true},
    );
}
