import { useAppState } from "../StateContext";

export function useReferralValidator() {
  const validator = useAppState("referralValidator");

  return {
    referral: validator.referral,
    setReferral: validator.setReferral,
    isValidating: validator.isValidating,
    isValid: validator.isValid,
    error: validator.error,
    errorCode: validator.errorCode,
  };
}
