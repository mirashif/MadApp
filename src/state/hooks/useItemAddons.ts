import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useItemAddons(itemID: string) {
  const items = useAppState("items");
  const itemAddons = computed(() => items.itemAddons(itemID)).get();

  return {
    itemAddons: itemAddons,
  };
}
