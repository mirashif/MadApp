import React, { useState } from "react";

import MobileNumber from "./MobileNumber";
import Verification from "./Verification";
import UserInfo from "./UserInfo";
import { STEPS } from "./constants";

const OnBoarding = () => {
  const [step, setStep] = useState<STEPS>(STEPS.MOBILE_NUMBER);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  switch (step) {
    case STEPS.MOBILE_NUMBER:
      return <MobileNumber {...{ setStep, phoneNumber, setPhoneNumber }} />;

    case STEPS.VERIFICATION:
      return <Verification {...{ setStep, phoneNumber, setPhoneNumber }} />;

    case STEPS.USER_INFO:
      return <UserInfo {...{ setStep, phoneNumber, setPhoneNumber }} />;

    default:
      return null;
  }
};

export default OnBoarding;
