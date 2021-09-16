import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useRestaurantCategories(restaurantID: string) {
    const categories = useAppState('categories');

    const categoriesResult = computed(() =>
        categories.categoriesFor(restaurantID),
    ).get();

    return {
        categories: categoriesResult,
    };
}
