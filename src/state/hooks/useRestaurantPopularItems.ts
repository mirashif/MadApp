import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useRestaurantPopularItems(restaurantID: string) {
  const items = useAppState("items");
  const itemsResult = computed(() =>
    items.popularForRestaurant(restaurantID)
  ).get();

  return {
    items: itemsResult,
  };
}
