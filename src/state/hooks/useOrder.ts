import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useOrders(id: string) {
    const orders = useAppState('orders');
    const order = computed(() => orders.get(id)).get();

    return {
        order,
    };
}
