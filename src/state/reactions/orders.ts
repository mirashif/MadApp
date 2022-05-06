import {action, autorun, reaction} from 'mobx';
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

    // TODO: Drop These eww.
    const handled = new Set<string>();

    autorun(() => {
        const waitingOrders = store.orders.pages[0].all.filter(
            (order) => order?.data.stage === 'waiting',
        );
        const order = waitingOrders[0] ?? null;

        if (!order) {
            return;
        }

        if (handled.has(order.data.id)) {
            return;
        }

        handled.add(order.data.id);

        if (order.data.paymentRequired) {
            action(() => (order.data.paymentURL = 'http://example.com'))();

            setTimeout(
                action(() => {
                    order.data.paymentRequired = false;
                    delete order.data.paymentURL;
                }),
                5000,
            );

            setTimeout(
                action(() => {
                    order.data.stage = 'preparing';
                    order.data.displayText = '3d Printing Buns ...';
                    order.data.timeLeft = {
                        from: 40,
                        to: 30,
                    };
                }),
                10000,
            );

            setTimeout(
                action(() => {
                    order.data.stage = 'delivering';
                    order.data.displayText =
                        'Rocket bikes are illegal, otherwise we would have used it.';

                    order.data.timeLeft = {
                        lessThan: 10,
                    };
                }),
                15000,
            );

            setTimeout(
                action(() => {
                    order.data.stage = 'delivered';
                    order.data.displayText = 'Go monch.';

                    order.data.timeLeft = {
                        string: 'delivered',
                    };
                }),
                20000,
            );
        } else {
            action(() => {
                order.data.stage = 'preparing';
                order.data.displayText = '3d Printing Buns ...';
                order.data.timeLeft = {
                    from: 40,
                    to: 30,
                };
            });

            setTimeout(
                action(() => {
                    order.data.stage = 'delivering';
                    order.data.displayText =
                        'Rocket bikes are illegal, otherwise we would have used it.';

                    order.data.timeLeft = {
                        lessThan: 10,
                    };
                }),
                10000,
            );

            setTimeout(
                action(() => {
                    order.data.stage = 'delivered';
                    order.data.displayText = 'Go monch.';

                    order.data.timeLeft = {
                        string: 'delivered',
                    };
                }),
                20000,
            );
        }
    });
}
