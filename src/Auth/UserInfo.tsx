import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  BackHandler,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

import {
  Box,
  CustomModal,
  HeaderBar,
  Icon,
  SafeArea,
  Text,
  useTheme,
} from "../components";
import { RootStackProps } from "../components/AppNavigator";
import Button from "../components/Button";

import Input from "./Input";
import Referral from "./assets/Referral.svg";

const UserInfo = ({ navigation }: RootStackProps<"AuthStack">) => {
  const theme = useTheme();

  const [referralCode, setReferralCode] = useState<null | string>(null);
  const [tempReferralCode, setTempReferralCode] = useState<null | string>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
          onBackPress={() =>
            navigation.navigate("AuthStack", { screen: "MobileNumber" })
          }
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

          {/* Name */}
          <Box mt="xl">
            <Text mb="m" fontFamily="Medium" style={{ color: "#111111" }}>
              Name
            </Text>
            <Input onChangeText={(value) => console.log(value)} />
          </Box>

          {/* Referral Code */}
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
                  onPress={() => setIsModalVisible(true)}
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
            <Button onPress={() => null} size="lg">
              Let's Go!
            </Button>
          </Box>
        </Box>
      </ScrollView>

      <CustomModal
        visible={isModalVisible}
        buttonTitle="Apply"
        onButtonPress={() => {
          setReferralCode(tempReferralCode);
          setIsModalVisible(!isModalVisible);
        }}
        onBackPress={() => setIsModalVisible(!isModalVisible)}
        onRequestClose={() => setIsModalVisible(!isModalVisible)}
      >
        <Box alignItems="center">
          <Referral />
        </Box>

        <Box my="m">
          <Input
            onChangeText={(value) => setTempReferralCode(value)}
            placeholder="Enter your referral code"
          />
        </Box>
      </CustomModal>
    </SafeArea>
  );
};

export default UserInfo;
