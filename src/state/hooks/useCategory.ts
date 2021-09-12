import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useCategory(categoryID: string) {
  const categories = useAppState("categories");
  const category = computed(() => categories.get(categoryID)).get();

  return {
    category: category,
  };
}
