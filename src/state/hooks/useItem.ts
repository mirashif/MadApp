import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useItem(itemID: string) {
  const items = useAppState("items");
  const item = computed(() => items.get(itemID)).get();

  return {
    item: item,
  };
}
