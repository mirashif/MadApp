import { useAppState } from "../StateContext";

export function useAuth() {
  const auth = useAppState("auth");

  return {
    authenticated: auth.authenticated,
    requestOTP: auth.requestOTP,
    authenticate: auth.authenticate,
    deauthenticate: auth.deauthenticate,
    lastRequest: auth.lastRequest,
  };
}
