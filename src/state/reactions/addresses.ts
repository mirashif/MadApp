import {autorun, reaction} from 'mobx';
import {withCleanup} from '../helpers/withCleanup';
import {Store} from '../store';

export function addressReactions(store: Store) {
    reaction(
        () => !!store.auth.user,
        withCleanup((shouldListen) => {
            console.log('LISTENING: Addresses');

            if (shouldListen) {
                store.addresses.listen();
            }

            return () => {
                store.addresses.unlisten();
            };
        }),
        {fireImmediately: true},
    );

    autorun(() => {
        console.log(
            '-------------TOMATO--------------',
            store.addresses.all.map((address) => address.data.id),
        );
    });
}
