import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useRestaurant(restaurantID: string) {
    const restaurants = useAppState('restaurants');
    const branches = useAppState('branches');

    const restaurant = computed(() => restaurants.get(restaurantID)).get();

    return {
        restaurant,
        get availableBranch() {
            if (!restaurant?.id) {
                return null;
            }

            return branches.availableFor(restaurant?.id)?.[0] || null;
        },
    };
}
