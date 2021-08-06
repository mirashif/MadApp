import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Icon, useTheme } from "../../components";

const QuantityHandler = ({
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
    <TouchableWithoutFeedback {...{ ...onPress, disabled }}>
      <Box
        style={{
          backgroundColor: isIncreaseButton
            ? theme.colors.background
            : "#F8F8F8",
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

export default QuantityHandler;
