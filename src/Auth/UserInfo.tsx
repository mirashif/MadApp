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
import Success from "./assets/Success.svg";

const UserInfo = ({ navigation }: RootStackProps<"AuthStack">) => {
  const theme = useTheme();

  const [refCode, setRefCode] = useState<null | string>(null);
  const [tempRefCode, setTempRefCode] = useState<null | string>(null);
  const [wrongRefCode, setWrongRefCode] = useState(false);
  const [refModalVisible, setRefModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

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

  const handleRefModalCTAPress = () => {
    if (wrongRefCode) {
      setWrongRefCode(false);
      return;
    }

    if (tempRefCode === "madapp") {
      setRefCode(tempRefCode);
      setRefModalVisible(!refModalVisible);
      return;
    }

    setWrongRefCode(true);
  };

  const hadleRefModalClose = () => {
    setWrongRefCode(false);
    setRefModalVisible(false);
  };

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
              {refCode && (
                <Box>
                  <Text fontSize={11} style={{ color: "#BEBEBE" }}>
                    REFERRAL
                  </Text>
                  <Text fontSize={14} fontFamily="Bold" color="primary">
                    {refCode.toUpperCase()}
                  </Text>
                </Box>
              )}

              {!refCode && (
                <Text fontSize={11} style={{ color: "#BBBBBB" }}>
                  No referral code added.
                </Text>
              )}
            </Box>

            <Box>
              {refCode && (
                <TouchableWithoutFeedback onPress={() => setRefCode(null)}>
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
              )}

              {!refCode && (
                <TouchableWithoutFeedback
                  onPress={() => setRefModalVisible(true)}
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
            <Button onPress={() => setSuccessModalVisible(true)} size="lg">
              Let's Go!
            </Button>
          </Box>
        </Box>
      </ScrollView>

      <CustomModal
        visible={refModalVisible}
        buttonTitle={wrongRefCode ? "Try Again" : "Apply"}
        onButtonPress={handleRefModalCTAPress}
        onBackPress={hadleRefModalClose}
        onRequestClose={hadleRefModalClose}
      >
        {wrongRefCode && (
          <>
            <Box alignItems="center" flexDirection="row" mt="l">
              <Text fontSize={50}>😰</Text>
              <Text fontSize={24} fontFamily="Medium" style={{ marginLeft: 8 }}>
                Uh Oh!
              </Text>
            </Box>

            <Text mt="m" fontSize={15} style={{ marginBottom: 45 }}>
              You entered an invalid referral code, please enter a valid
              referral code to get a discount
            </Text>
          </>
        )}

        {!wrongRefCode && (
          <>
            <Box alignItems="center">
              <Referral />
            </Box>

            <Box my="m">
              <Input
                onChangeText={(value) => setTempRefCode(value)}
                placeholder="Enter your referral code"
              />
            </Box>
          </>
        )}
      </CustomModal>

      <CustomModal
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
        buttonTitle="Let’s go"
        onButtonPress={() => setSuccessModalVisible(false)}
      >
        <Box
          alignItems="center"
          justifyContent="center"
          style={{ paddingBottom: 55, paddingTop: 32 }}
        >
          <Success />
          <Text fontSize={18} style={{ color: "#323232" }}>
            Wohoo! you’re done
          </Text>
        </Box>
      </CustomModal>
    </SafeArea>
  );
};

export default UserInfo;
