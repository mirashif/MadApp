import type React from "react";

export const OTP_TIMER = 60;

export enum STEPS {
  MOBILE_NUMBER,
  VERIFICATION,
  USER_INFO,
}

export interface OnBoardingStepProps {
  setStep: React.Dispatch<React.SetStateAction<STEPS>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  disableGoingBack?: boolean;
}
