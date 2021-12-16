import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useCategoryItems(categoryID: string) {
    const items = useAppState('items');
    const itemsResult = computed(() => items.getForCategory(categoryID)).get();

    return {
        items: itemsResult,
    };
}
