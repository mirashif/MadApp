import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useBranch(id: string) {
  const branches = useAppState("branches");
  const branch = computed(() => branches.get(id)).get();

  return {
    branch,
  };
}
