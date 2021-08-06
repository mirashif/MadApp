import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Icon, Text, useTheme } from "../../components";

interface VoucherButtonProps {
  onPress: () => void;
}

const VoucherButton = ({ onPress }: VoucherButtonProps) => {
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

export default VoucherButton;
