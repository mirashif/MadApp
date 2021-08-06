import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Icon, Text } from "../../components";

interface CheckoutButtonProps {
  onPress: () => void;
}

const CheckoutButton = ({ onPress }: CheckoutButtonProps) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Box
        backgroundColor="primary"
        height={57}
        width={358}
        borderRadius="l"
        position="relative"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="background" fontSize={17}>
          Checkout
        </Text>

        <Box style={{ position: "absolute", right: 18, top: 15 }}>
          <Icon name="chevron-right" size={24} color="#fff" />
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default CheckoutButton;
