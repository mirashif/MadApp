import React, { useState } from "react";

import type { RootStackProps } from "../components/AppNavigator";

import MobileNumber from "./MobileNumber";
import Verification from "./Verification";
import UserInfo from "./UserInfo";
import { STEPS } from "./constants";

const OnBoarding = ({ route }: RootStackProps<"OnBoarding">) => {
  const [step, setStep] = useState<STEPS>(
    route?.params?.step ?? STEPS.MOBILE_NUMBER
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  switch (step) {
    case STEPS.MOBILE_NUMBER:
      return <MobileNumber {...{ setStep, phoneNumber, setPhoneNumber }} />;

    case STEPS.VERIFICATION:
      return <Verification {...{ setStep, phoneNumber, setPhoneNumber }} />;

    case STEPS.USER_INFO:
      return (
        <UserInfo
          {...{ setStep, phoneNumber, setPhoneNumber }}
          disableGoingBack={!!route?.params?.step}
        />
      );

    default:
      return null;
  }
};

export default OnBoarding;
