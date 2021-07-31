import React from "react";

import { Box, SafeArea, Text } from "../components";

import Card, { assets as CardAssets } from "./Card";
import Coupon from "./Coupon";

export const assets = [...CardAssets];

const Cashback = () => {
  return (
    <SafeArea>
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
            purus sit amet luctus venenatis, lectus magna
          </Text>
        </Box>
        <Box mb="xl">
          <Text variant="sectionTitle" my="xl">
            🏆 Discount Coupons
          </Text>
          <Box my="xl">
            <Coupon
              onPress={() => console.log("Cashback Redeem")}
              discount="100"
              minimum="250"
              points="500"
            />
          </Box>
          <Box my="xl">
            <Coupon
              disabled
              onPress={() => console.log("Cashback Redeem")}
              discount="100"
              minimum="250"
              points="2,000"
            />
          </Box>
        </Box>
      </Box>
    </SafeArea>
  );
};

export default Cashback;
