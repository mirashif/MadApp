import {reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function bannerReactions(store: Store) {
    reaction(
        () => true,
        withCleanup((shouldListen, previousShouldListen) => {
            if (shouldListen !== previousShouldListen && shouldListen) {
                console.log('LISTENING: Banners');

                store.banners.listen();

                return () => {
                    store.banners.unlisten();
                };
            }
        }),
        {fireImmediately: true},
    );
}
