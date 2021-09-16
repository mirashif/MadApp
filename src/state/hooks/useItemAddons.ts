import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useItemAddons(itemID: string) {
    const items = useAppState('items');
    const itemAddons = computed(() => items.itemAddons(itemID)).get();

    return {
        itemAddons: itemAddons,
    };
}
