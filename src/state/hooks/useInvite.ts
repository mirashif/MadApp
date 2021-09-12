import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useInvite(id: string) {
  const invites = useAppState("invites");
  const invite = computed(() => invites.get(id)).get();

  return {
    invite: invite,
  };
}
