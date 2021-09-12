import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useCashback(id: string) {
  const cashbacks = useAppState("cashbacks");
  const cashback = computed(() => cashbacks.get(id)).get();

  return {
    cashback: cashback,
  };
}
