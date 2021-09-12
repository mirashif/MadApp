import { useAppState } from "../StateContext";

export function useRestaurants() {
  const restaurants = useAppState("restaurants");

  return {
    restaurants: restaurants.all,
  };
}
