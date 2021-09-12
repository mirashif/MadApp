import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useItemVariantGroups(itemID: string) {
  const items = useAppState("items");
  const itemVariantGroups = computed(() =>
    items.itemVariantGroups(itemID)
  ).get();

  return {
    itemVariantGroups: itemVariantGroups,
  };
}
