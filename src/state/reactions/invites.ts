import {reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function inviteReactions(store: Store) {
    reaction(
        () => !!store.auth.user,
        withCleanup((shouldListen) => {
            if (shouldListen) {
                console.log('LISTENING: Invites');
                store.invites.listen();
            }

            return () => {
                store.invites.unlisten();
            };
        }),
        {fireImmediately: true},
    );
}
