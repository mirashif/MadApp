import React from "react";

import { Box, HeaderBar, SafeArea, Text } from "../../components";

import OrderDetails from "./OrderDetails";

const details = {
  restaurant: "Cheez",
  deliveryAddress: "House 17/A, Road 16/B",
  orderNumber: "#rbbi-mhdi-42",
};

const StepsIndicator = ({ active }: { active?: boolean }) => (
  <Box
    borderRadius="xl"
    style={{
      width: 73,
      height: 8,
      backgroundColor: active ? "#FF385A" : "#CBCBCB",
    }}
  />
);

const OrderProcessing = () => {
  return (
    <SafeArea>
      <HeaderBar title="Your Order" />
      <Box flex={1} style={{ marginTop: 110 }}>
        <Box alignItems="center">
          <Text fontSize={36}>30 - 40 mins</Text>
          <Text fontSize={18} mt="s">
            Estimated delivery time
          </Text>
        </Box>

        <Box alignItems="center">
          <Box
            flexDirection="row"
            width={235}
            justifyContent="space-between"
            style={{ marginTop: 32 }}
          >
            <StepsIndicator active />
            <StepsIndicator />
            <StepsIndicator />
          </Box>

          <Text
            style={{
              marginTop: 25,
              fontSize: 18,
              width: 320,
              textAlign: "center",
            }}
          >
            Cheez is preparing your order
          </Text>
        </Box>

        <OrderDetails {...{ ...details }} />
      </Box>
    </SafeArea>
  );
};

export default OrderProcessing;
