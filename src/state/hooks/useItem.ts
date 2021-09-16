import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useItem(itemID: string) {
    const items = useAppState('items');
    const item = computed(() => items.get(itemID)).get();

    return {
        item: item,
    };
}
