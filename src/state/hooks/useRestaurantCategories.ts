import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useRestaurantCategories(restaurantID: string) {
  const categories = useAppState("categories");

  const categoriesResult = computed(() =>
    categories.categoriesFor(restaurantID)
  ).get();

  return {
    categories: categoriesResult,
  };
}
