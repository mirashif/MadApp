import React from "react";
import { TextInput, Alert, ScrollView } from "react-native";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";

import { Box, HeaderBar, SafeArea, Text } from "../components";
import DissmissKeyboard from "../components/DissmissKeyboard";
import Button from "../components/Button";
import { useAppState } from "../state/StateContext";
import type { AuthStore } from "../state/store/AuthStore";
import type { RootStackProps } from "../components/AppNavigator";

import Phone from "./assets/Phone.svg";
import BDFlag from "./assets/BDFlag.svg";
import type { OnBoardingStepProps } from "./constants";
import { STEPS } from "./constants";

const MobileNumber = observer(
  ({ setStep, phoneNumber, setPhoneNumber }: OnBoardingStepProps) => {
    const navigation =
      useNavigation<RootStackProps<"BottomTabs">["navigation"]>();

    const auth: AuthStore = useAppState("auth");

    const handleContinue = async () => {
      const isValid = /^01[3-9]\d{8}$/.test(phoneNumber);
      if (!isValid) return Alert.alert("Please enter a valid mobile number");
      try {
        await auth.requestOTP(phoneNumber);
        setPhoneNumber(phoneNumber);
        setStep(STEPS.VERIFICATION);
      } catch (err) {
        Alert.alert("Something went wrong");
      }
    };

    return (
      <SafeArea>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <HeaderBar
            title="Your Details"
            onBackPress={() =>
              navigation.navigate("BottomTabs", { screen: "Home" })
            }
          />

          <DissmissKeyboard>
            <Box flex={1} px="screen">
              <Box alignItems="center" style={{ marginTop: 32 }}>
                <Phone />
              </Box>

              <Text
                fontSize={24}
                fontFamily="Bold"
                textAlign="center"
                style={{ color: "#323232", marginTop: 26 }}
              >
                What's Your Mobile Number?
              </Text>

              <Box alignItems="center" my="l">
                <Box width={288}>
                  <Text style={{ color: "#BBBBBB" }} textAlign="center">
                    We need this to verify and secure your account
                  </Text>
                </Box>
              </Box>

              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
              >
                <Box flexDirection="row" alignItems="center">
                  <BDFlag />
                  <Text
                    fontSize={18}
                    style={{ color: "#111111", marginLeft: 8 }}
                  >
                    +88
                  </Text>
                </Box>

                <Box ml="m">
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={setPhoneNumber}
                    maxLength={11}
                    style={{
                      borderColor: "#DDDDDD",
                      borderWidth: 1,
                      width: 220,
                      padding: 14,
                      fontSize: 18,
                      borderRadius: 12,
                    }}
                  />
                </Box>
              </Box>

              <Box style={{ paddingTop: 16, paddingBottom: 40, marginTop: 14 }}>
                <Button onPress={handleContinue} size="lg">
                  Continue
                </Button>
              </Box>
            </Box>
          </DissmissKeyboard>
        </ScrollView>
      </SafeArea>
    );
  }
);

export default MobileNumber;
