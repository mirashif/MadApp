import {useAppState} from '../StateContext';

export function useCashbacks() {
    const cashbacks = useAppState('cashbacks');

    return {
        cashbacks: cashbacks.all,
    };
}
