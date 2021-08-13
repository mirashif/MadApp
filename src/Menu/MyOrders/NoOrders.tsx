import React from "react";

import { Box, Button, Text } from "../../components";

import SadEmoji from "./assets/SadEmoji.svg";

interface NoOrdersProps {
  onCTAPress: () => void;
}

const NoOrders = ({ onCTAPress }: NoOrdersProps) => {
  return (
    <Box alignItems="center">
      <SadEmoji />

      <Text fontSize={24} style={{ color: "#5B5B5B", marginTop: 46 }}>
        No Orders Yet
      </Text>

      <Box width={237}>
        <Text textAlign="center" style={{ color: "#AAAAAA", marginTop: 22 }}>
          You don’t have any orders yet, Try one of our awesome restaurants and
          place your first order.
        </Text>
      </Box>

      <Button size="lg" onPress={onCTAPress} style={{ marginTop: 65 }}>
        Browse Restaurants
      </Button>
    </Box>
  );
};

export default NoOrders;
