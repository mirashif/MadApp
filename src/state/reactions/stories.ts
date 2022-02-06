import {reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function storyReactions(store: Store) {
    reaction(
        () => true,
        withCleanup((shouldListen, previousShouldListen) => {
            if (shouldListen !== previousShouldListen && shouldListen) {
                console.log('LISTENING: Stories');

                store.stories.listen();
            }

            return () => {
                store.stories.unlisten();
            };
        }),
        {fireImmediately: true},
    );
}
