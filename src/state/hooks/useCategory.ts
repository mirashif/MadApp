import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useCategory(categoryID: string) {
    const categories = useAppState('categories');
    const category = computed(() => categories.get(categoryID)).get();

    return {
        category: category,
    };
}
