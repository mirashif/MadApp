import React, { useState } from "react";
import { ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";

import { Box, CustomModal, SafeArea, Text } from "../components";

import Card, { assets as CardAssets } from "./Card";
import Coupon from "./Coupon";

export const assets = [...CardAssets];

const Cashback = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const handleCopyPress = () => {
    Clipboard.setString("RBIMHDI-100");
    setModalVisible(false);
  };

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="screen">
          <Box my="xl">
            <Card points="1,707" name="Rabbi Mehedi" />
          </Box>

          <Box mb="xl">
            <Text
              style={{
                fontFamily: "Bold",
                fontSize: 26,
                marginBottom: 7,
              }}
            >
              Redeem Points
            </Text>
            <Text color="gray" fontSize={14}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
              aliquam, purus sit amet luctus venenatis, lectus magna
            </Text>
          </Box>

          <Box mb="xl">
            <Text variant="sectionTitle" my="xl">
              🏆 Discount Coupons
            </Text>

            <Box my="xl">
              <Coupon
                onPress={() => setModalVisible(true)}
                discount="100"
                minimum="250"
                points="500"
              />
            </Box>

            <Box my="xl">
              <Coupon
                disabled
                onPress={() => setModalVisible(true)}
                discount="100"
                minimum="250"
                points="2,000"
              />
            </Box>
          </Box>
        </Box>
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        buttonTitle="Copy"
        onButtonPress={handleCopyPress}
      >
        <Box alignItems="center" mt="l">
          <Text fontSize={82} mb="l">
            🎁
          </Text>

          <Text fontSize={11}>YOU HAVE REDEEMED A VOUCHER</Text>

          <Text fontSize={24} fontFamily="Bold" color="primary">
            Get ৳100 OFF
          </Text>

          <Text fontSize={11}>APPLY THE VOUCHER ON YOUR NEXT ORDER</Text>
        </Box>

        <Box
          height={44}
          justifyContent="center"
          borderWidth={1}
          borderColor="lightGray"
          borderRadius="l"
          px="l"
          my="l"
        >
          <Text>RBIMHDI-100</Text>
        </Box>
      </CustomModal>
    </SafeArea>
  );
};

export default Cashback;
