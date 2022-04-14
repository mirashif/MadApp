import React, { useState, useEffect } from "react";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Alert, ScrollView } from "react-native";
import { observer } from "mobx-react";
import { StackActions, useNavigation } from "@react-navigation/native";

import { Box, HeaderBar, makeStyles, SafeArea, Text } from "../components";
import DissmissKeyboard from "../components/DissmissKeyboard";
import Button from "../components/Button";
import { useAppState } from "../state/StateContext";
import type { AuthStore } from "../state/store/AuthStore";
import type { UserStore } from "../state/store/UserStore";
import type { RootStackProps } from "../components/AppNavigator";

import OTPVerify from "./assets/OTPVerify.svg";
import type { OnBoardingStepProps } from "./constants";
import { OTP_TIMER, STEPS } from "./constants";

const Verification = observer(
  ({ setStep, phoneNumber }: OnBoardingStepProps) => {
    const styles = useStyles();
    const navigation =
      useNavigation<RootStackProps<"BottomTabs">["navigation"]>();

    const auth: AuthStore = useAppState("auth");
    const userStore: UserStore = useAppState("user");
    const user = userStore.user;

    const [counter, setCounter] = useState(OTP_TIMER - 1);
    const [otp, setOtp] = useState<null | string>(null);

    const handleContinue = async () => {
      if (!otp) return Alert.alert("Please enter OTP");
      try {
        await auth.authenticate(phoneNumber, otp);
      } catch (err) {
        Alert.alert("Something went wrong!");
      }
    };

    useEffect(() => {
      const isLoggedIn = auth.authenticated;
      if (!isLoggedIn || !user) return;
      if (user.firstName && user.lastName)
        navigation.dispatch(
          StackActions.replace("BottomTabs", { screen: "Home" })
        );
      else setStep(STEPS.USER_INFO);
    }, [auth, navigation, setStep, user]);

    let interval: any = null;
    const startTimer = () => {
      interval = setInterval(() => {
        const secondsSinceRequest: number =
          auth.secondsSinceRequest(phoneNumber);
        if (secondsSinceRequest > OTP_TIMER) {
          clearInterval(interval);
          return;
        }
        setCounter((c) => c - 1);
      }, 1000);
    };

    useEffect(() => {
      startTimer();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleResend = async () => {
      try {
        await auth.requestOTP(phoneNumber);
      } catch (error) {
        console.error(error);
      } finally {
        setCounter(OTP_TIMER - 1);
        startTimer();
      }
    };

    return (
      <SafeArea>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <HeaderBar
            title="Account Verification"
            onBackPress={() => setStep(STEPS.MOBILE_NUMBER)}
          />

          <DissmissKeyboard>
            <Box flex={1}>
              <Box alignItems="center" style={{ marginTop: 72 }}>
                <OTPVerify />

                <Box width={263} style={{ marginTop: 25, marginBottom: 14 }}>
                  <Text
                    textAlign="center"
                    fontSize={18}
                    fontFamily="Bold"
                    style={{ color: "#323232" }}
                  >
                    We’ve sent a verification code to your phone number
                  </Text>
                </Box>

                <Text style={{ color: "#BBBBBB" }}>{phoneNumber}</Text>

                <Box width={300} height={50} style={{ marginTop: 14 }}>
                  <OTPInputView
                    pinCount={6}
                    codeInputFieldStyle={styles.codeInputFieldStyle}
                    autoFocusOnLoad={false}
                    keyboardType="number-pad"
                    onCodeChanged={(code) => setOtp(code)}
                    onCodeFilled={(code) => setOtp(code)}
                  />
                </Box>
              </Box>

              <Box
                px="screen"
                style={{ paddingTop: 16, paddingBottom: 40, marginTop: 14 }}
              >
                <Button size="lg" onPress={handleContinue}>
                  Continue
                </Button>
                <Button
                  style={{
                    marginTop: 8,
                  }}
                  variant="text"
                  onPress={handleResend}
                  disabled={counter > 0}
                >
                  Resend
                  {counter > 0 && ` | Wait ${counter}s`}
                </Button>
              </Box>
            </Box>
          </DissmissKeyboard>
        </ScrollView>
      </SafeArea>
    );
  }
);

const useStyles = makeStyles(() => ({
  codeInputFieldStyle: {
    color: "#000",
    width: 45,
    height: 49,
    borderWidth: 1.5,
    borderRadius: 12,
    fontFamily: "Medium",
    fontSize: 18,
    borderColor: "rgba(187, 187, 187, 0.5)",
  },
}));

export default Verification;
