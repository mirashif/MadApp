import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useCategoryItems(categoryID: string) {
  const items = useAppState("items");
  const itemsResult = computed(() => items.getForCategory(categoryID)).get();

  return {
    items: itemsResult,
  };
}
