import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Button, CurrencyFormat, Text } from "../../components";

interface PastOrderItemProps {
  variant: "CANCELLED" | "DELIVERED";
  onPress: () => void;
  onCTAPress: () => void;
}

const PastOrderItem = ({
  variant,
  onCTAPress,
  onPress,
}: PastOrderItemProps) => {
  return (
    <TouchableWithoutFeedback {...{ onPress }}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        style={{ paddingHorizontal: 32, paddingVertical: 8, marginBottom: 30 }}
      >
        <Box>
          <Text fontSize={16} fontFamily="Bold">
            Pagla Baburchi
          </Text>
          <Text style={{ marginTop: 2 }}>
            <CurrencyFormat value={619.0} />
          </Text>

          <Box mt="m">
            <Text fontSize={11} style={{ color: "#939393" }}>
              1x Chagla Biriyani
            </Text>
          </Box>

          <Text
            mt="s"
            fontSize={11}
            fontFamily="Bold"
            style={{ color: variant === "CANCELLED" ? "#FF385A" : "#A3C02D" }}
          >
            {variant === "CANCELLED" ? "CANCELLED" : "DELIVERED"}
          </Text>
        </Box>

        <Box alignItems="flex-end">
          <Button size="sm" onPress={onCTAPress}>
            Reorder
          </Button>

          <Text mt="l" mr="m" fontSize={11} style={{ color: "#BBBBBB" }}>
            July 9th, 2021
          </Text>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default PastOrderItem;
