import { useAppState } from "../StateContext";

export function useInvites() {
  const invites = useAppState("invites");

  return {
    invites: invites.all,
  };
}
