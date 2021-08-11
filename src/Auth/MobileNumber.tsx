import React, { useState } from "react";
import { TextInput, Alert, ScrollView } from "react-native";

import { Box, HeaderBar, SafeArea, Text } from "../components";
import DissmissKeyboard from "../components/DissmissKeyboard";

import Button from "./Button";
import Phone from "./assets/Phone.svg";
import BDFlag from "./assets/BDFlag.svg";

import { AuthStackProps } from ".";

const MobileNumber = ({ navigation }: AuthStackProps<"MobileNumber">) => {
  const [phoneNumber, setPhoneNumber] = useState<null | string>(null);

  const handleContinue = () => {
    if (phoneNumber) {
      navigation.navigate("Verification", {
        phoneNumber,
      });
    } else {
      Alert.alert("Please enter a phone number");
    }
  };

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="Your Details" onBackPress={() => null} />

        <DissmissKeyboard>
          <Box flex={1} px="screen">
            <Box flex={1}>
              <Box>
                <Box alignItems="center" style={{ marginTop: 32 }}>
                  <Phone />
                </Box>

                <Text
                  fontSize={24}
                  fontFamily="Bold"
                  textAlign="center"
                  style={{ color: "#323232", marginTop: 26 }}
                >
                  What’s Your Mobile Number?
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
                      onChangeText={(value) => setPhoneNumber(value)}
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
              </Box>

              <Box style={{ paddingTop: 16, paddingBottom: 40, marginTop: 14 }}>
                <Button title="Continue" onPress={handleContinue} />
              </Box>
            </Box>
          </Box>
        </DissmissKeyboard>
      </ScrollView>
    </SafeArea>
  );
};

export default MobileNumber;
