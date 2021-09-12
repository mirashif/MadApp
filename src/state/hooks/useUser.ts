import { useAppState } from "../StateContext";

export function useUser() {
  const user = useAppState("user");

  return {
    user: user.user,
    attributes: user.userAttributes,
    updateUser: user.updateUser,
  };
}
