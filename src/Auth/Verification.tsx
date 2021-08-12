import React, { useState, useEffect } from "react";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { ScrollView } from "react-native";

import { Box, HeaderBar, makeStyles, SafeArea, Text } from "../components";
import DissmissKeyboard from "../components/DissmissKeyboard";
import Button from "../components/Button";

import OTPVerify from "./assets/OTPVerify.svg";

import { AuthStackProps } from ".";

const Verification = ({
  route,
  navigation,
}: AuthStackProps<"Verification">) => {
  const styles = useStyles();

  const { phoneNumber } = route.params;

  const [otp, setOtp] = useState<null | string>(null);

  useEffect(() => {
    console.log("otp", otp);
  }, [otp]);

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

              <Box width={250} height={50} style={{ marginTop: 14 }}>
                <OTPInputView
                  pinCount={5}
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
              <Button size="lg" onPress={() => navigation.navigate("UserInfo")}>
                Continue
              </Button>
            </Box>
          </Box>
        </DissmissKeyboard>
      </ScrollView>
    </SafeArea>
  );
};

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