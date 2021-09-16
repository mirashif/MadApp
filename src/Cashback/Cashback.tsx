import React, { useState } from "react";
import { ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";
import { observer } from "mobx-react";

import { Box, CustomModal, SafeArea, Text } from "../components";
import { useCashbacks } from "../state/hooks/useCashbacks";
import type { CashbackWithAvailabilityType } from "../state/store/CashbackStore";
import { useUser } from "../state/hooks/useUser";

import Card, { assets as CardAssets } from "./Card";
import Coupon from "./Coupon";

export const assets = [...CardAssets];

const Cashback = observer(() => {
  const { cashbacks } = useCashbacks();
  const { user, attributes } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCashback, setSelectedCashback] =
    useState<null | CashbackWithAvailabilityType>(null);

  const handleCopyPress = () => {
    if (selectedCashback) {
      Clipboard.setString(selectedCashback.cashbackCouponCode);
      setModalVisible(false);
    }
  };

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="screen">
          <Box my="xl">
            <Card
              points={attributes?.points || 0}
              name={`${user?.firstName} ${user?.lastName}`}
            />
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

            {cashbacks.map((cashback) => (
              <Box my="xl" key={cashback.id}>
                <Coupon
                  disabled={!cashback.isAvailable}
                  onPress={() => {
                    setSelectedCashback(cashback);
                    setModalVisible(true);
                  }}
                  name={cashback.name}
                  minimum={cashback.minimumOrderAmount}
                  points={cashback.requiredPoints}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedCashback(null);
        }}
        buttonTitle="Copy"
        onButtonPress={handleCopyPress}
      >
        <Box alignItems="center" mt="l">
          <Text fontSize={82} mb="l">
            🎁
          </Text>

          <Text fontSize={11}>YOU HAVE REDEEMED A VOUCHER</Text>

          <Text fontSize={24} fontFamily="Bold" color="primary">
            {selectedCashback?.name}
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
          <Text>{selectedCashback?.cashbackCouponCode}</Text>
        </Box>
      </CustomModal>
    </SafeArea>
  );
});

export default Cashback;
