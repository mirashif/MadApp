import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Icon, Text } from "../../components";

interface OrderSummaryItemProps {
  title: string;
  description: string;
}

const Item = ({ title, description }: OrderSummaryItemProps) => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ marginBottom: 6 }}
    >
      <Text style={{ color: "#111111" }}>{title}</Text>
      <Text style={{ color: "#8A8A8A" }}>{description}</Text>
    </Box>
  );
};

export const Discount = ({
  amount,
  onDiscountCancel,
}: {
  amount: number;
  onDiscountCancel: () => void;
}) => {
  return (
    <Box justifyContent="space-between" flexDirection="row" alignItems="center">
      <Box flexDirection="row" alignItems="center">
        <Text color="primary" mr="l">
          Discount
        </Text>

        <TouchableWithoutFeedback onPress={onDiscountCancel}>
          <Box
            width={25}
            height={25}
            backgroundColor="primary"
            alignItems="center"
            justifyContent="center"
            borderRadius="xl"
          >
            <Icon name={"x"} size={18} color="#fff" />
          </Box>
        </TouchableWithoutFeedback>
      </Box>
      <Text color="primary">- ৳{amount}</Text>
    </Box>
  );
};

export default Item;
