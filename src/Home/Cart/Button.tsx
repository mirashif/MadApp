import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Icon, Text, useTheme } from "../../components";

interface ButtonProps {
  onPress: () => void;
}

export const CheckoutButton = ({
  onPress,
  label = "Checkout",
}: {
  onPress: () => void;
  label?: string;
}) => {
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
          {label}
        </Text>

        <Box style={{ position: "absolute", right: 18, top: 15 }}>
          <Icon name="chevron-right" size={24} color="#fff" />
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export const ClearCartButton = ({ onPress }: ButtonProps) => {
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Box flexDirection="row" alignItems="center">
        <Icon name="x-circle" color={theme.colors.primary} />
        <Text marginLeft="s" color="primary" fontSize={12}>
          Clear Cart
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export const QuantityButton = ({
  disabled,
  onPress,
  isIncreaseButton,
}: {
  disabled?: boolean;
  isIncreaseButton?: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback {...{ onPress, disabled }}>
      <Box
        style={{
          backgroundColor: isIncreaseButton ? theme.colors.primary : "#F8F8F8",
          width: 34,
          height: 34,
          borderRadius: 21,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isIncreaseButton ? (
          <Icon name="plus" color="#fff" size={18} />
        ) : (
          <Icon name="minus" color="#8A8A8A" size={18} />
        )}
      </Box>
    </TouchableWithoutFeedback>
  );
};

export const VoucherButton = ({ onPress }: ButtonProps) => {
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Box alignItems="flex-end">
        <Box
          flexDirection="row"
          alignItems="center"
          height={29}
          width={158}
          borderColor="primary"
          borderWidth={1}
          borderRadius="xl"
          justifyContent="center"
        >
          <Icon name="percent" color={theme.colors.primary} />
          <Text color="primary" ml="m">
            Apply a voucher
          </Text>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};
