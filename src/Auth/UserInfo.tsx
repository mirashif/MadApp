import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, ScrollView } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { Box, HeaderBar, Icon, SafeArea, Text, useTheme } from "../components";

import Input from "./Input";
import Button from "./Button";

import { AuthStackProps } from ".";

const UserInfo = ({ navigation }: AuthStackProps<"UserInfo">) => {
  const theme = useTheme();

  const [referralCode, setReferralCode] = useState<null | string>(null);

  /**
   * When user presses back button it takes to the mobile number screen
   */
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.pop(2);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", () => null);
    }, [navigation])
  );

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar
          title="Profile"
          onBackPress={() => navigation.navigate("MobileNumber")}
        />

        <Box px="screen">
          <Box alignItems="center">
            <Text fontSize={64}>🥳</Text>
            <Text
              fontSize={18}
              fontFamily="Bold"
              mt="l"
              style={{ color: "#323232" }}
            >
              You’re almost done!
            </Text>
          </Box>

          <Box mt="xl">
            <Text mb="m" fontFamily="Medium" style={{ color: "#111111" }}>
              Name
            </Text>
            <Input onChange={(value) => console.log(value)} />
          </Box>

          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mt="xl"
          >
            <Box>
              {referralCode ? (
                <Box>
                  <Text fontSize={11} style={{ color: "#BEBEBE" }}>
                    REFERRAL
                  </Text>
                  <Text fontSize={14} fontFamily="Bold" color="primary">
                    {referralCode.toUpperCase()}
                  </Text>
                </Box>
              ) : (
                <Text fontSize={11} style={{ color: "#BBBBBB" }}>
                  No referral code added.
                </Text>
              )}
            </Box>

            <Box>
              {referralCode ? (
                <TouchableWithoutFeedback onPress={() => setReferralCode(null)}>
                  <Box
                    height={25}
                    width={25}
                    backgroundColor="primary"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="xl"
                  >
                    <Icon name="x" size={16} color="#fff" />
                  </Box>
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => setReferralCode("RABBILITV")}
                >
                  <Box
                    width={108}
                    height={23}
                    borderColor="primary"
                    borderWidth={1}
                    borderRadius="l"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={11} color="primary">
                      Add Referral
                    </Text>
                  </Box>
                </TouchableWithoutFeedback>
              )}
            </Box>
          </Box>

          <Box
            style={{
              marginTop: 26,
              paddingHorizontal: 25,
              paddingVertical: 23,
            }}
            borderColor="lightGray"
            borderWidth={1}
            borderRadius="l"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box flexDirection="row">
              <Icon name="navigation" size={14} color={theme.colors.primary} />
              <Text
                style={{ marginLeft: 12 }}
                fontFamily="Bold"
                fontSize={15}
                color="primary"
              >
                Set Your Address
              </Text>
            </Box>

            <Icon name="edit-2" size={14} color={theme.colors.primary} />
          </Box>

          <Box style={{ paddingTop: 16, paddingBottom: 40, marginTop: 14 }}>
            <Button title="Continue" onPress={() => null} />
          </Box>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

export default UserInfo;
