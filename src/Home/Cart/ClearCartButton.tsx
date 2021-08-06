import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Icon, Text, useTheme } from "../../components";

interface ClearCartButtonProps {
  onPress: () => void;
}

const ClearCartButton = ({ onPress }: ClearCartButtonProps) => {
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

export default ClearCartButton;
