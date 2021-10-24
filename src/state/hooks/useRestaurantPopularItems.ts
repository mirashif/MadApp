import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useRestaurantPopularItems(restaurantID: string) {
    const items = useAppState('items');
    const itemsResult = computed(() =>
        items.popularForRestaurant(restaurantID),
    ).get();

    return {
        items: itemsResult,
    };
}
