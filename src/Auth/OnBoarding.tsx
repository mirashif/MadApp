import React, { useState } from "react";

import MobileNumber from "./MobileNumber";
import Verification from "./Verification";
import UserInfo from "./UserInfo";

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

const OnBoarding = () => {
  const [step, setStep] = useState<STEPS>(STEPS.MOBILE_NUMBER);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [count, setCount] = useState(OTP_TIMER - 1);

  switch (step) {
    case STEPS.MOBILE_NUMBER:
      return <MobileNumber {...{ setStep, phoneNumber, setPhoneNumber }} />;

    case STEPS.VERIFICATION:
      return (
        <Verification
          {...{ setStep, phoneNumber, setPhoneNumber, count, setCount }}
        />
      );

    case STEPS.USER_INFO:
      return <UserInfo {...{ setStep, phoneNumber, setPhoneNumber }} />;

    default:
      return null;
  }
};

export default OnBoarding;
