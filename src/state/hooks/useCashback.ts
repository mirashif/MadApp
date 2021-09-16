import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useCashback(id: string) {
    const cashbacks = useAppState('cashbacks');
    const cashback = computed(() => cashbacks.get(id)).get();

    return {
        cashback: cashback,
    };
}
