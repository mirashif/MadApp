import type React from "react";
export { default as OnBoarding } from "./OnBoarding";

export enum STEPS {
  MOBILE_NUMBER,
  VERIFICATION,
  USER_INFO,
}

export interface OnBoardingStepProps {
  setStep: React.Dispatch<React.SetStateAction<STEPS>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
}

export const OTP_TIMER = 60;
