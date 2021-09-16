import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useItemVariantGroups(itemID: string) {
    const items = useAppState('items');
    const itemVariantGroups = computed(() =>
        items.itemVariantGroups(itemID),
    ).get();

    return {
        itemVariantGroups: itemVariantGroups,
    };
}
