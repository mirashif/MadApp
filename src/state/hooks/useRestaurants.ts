import {useAppState} from '../StateContext';

export function useRestaurants() {
    const restaurants = useAppState('restaurants');

    return {
        get restaurants() {
            return restaurants.all;
        },
        get: restaurants.get,
    };
}
