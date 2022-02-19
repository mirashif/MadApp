import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Icon, Text } from "../../components";

const Discount = ({
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

export default Discount;
