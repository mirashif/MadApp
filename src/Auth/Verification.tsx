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

import OTPVerify from "./assets/OTPVerify.svg";

import type { AuthStackProps } from ".";

const Verification = observer(({ route }: AuthStackProps<"Verification">) => {
  const styles = useStyles();
  const navigation = useNavigation();
  const { phoneNumber } = route.params;

  const userStore: UserStore = useAppState("user");
  const auth: AuthStore = useAppState("auth");
  const [otp, setOtp] = useState<null | string>(null);
  const { user } = userStore;
  const secondsSinceRequest: number = auth.secondsSinceRequest(phoneNumber);

  const handleContinue = async () => {
    if (otp) {
      try {
        await auth.authenticate(phoneNumber, otp);
      } catch (err) {
        Alert.alert("Something went wrong!");
      }
    } else {
      Alert.alert("Please enter OTP");
    }
  };

  useEffect(() => {
    if (auth.authenticated) {
      if (user) {
        if (user.firstName && user.lastName) {
          navigation.dispatch(
            StackActions.replace("BottomTabs", { screen: "Home" })
          );
        } else {
          navigation.dispatch(
            StackActions.replace("AuthStack", { screen: "UserInfo" })
          );
        }
      }
    }
  }, [auth, navigation, user]);

  return (
    <SafeArea>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <HeaderBar title="Account Verification" />

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
                  autoFocusOnLoad={true}
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
                onPress={() => undefined}
                disabled
              >
                Resend | Wait 30s {secondsSinceRequest}
              </Button>
            </Box>
          </Box>
        </DissmissKeyboard>
      </ScrollView>
    </SafeArea>
  );
});

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
