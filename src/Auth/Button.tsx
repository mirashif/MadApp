import React from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { Box, Text } from "../components";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button = ({ title, onPress }: ButtonProps) => {
  return (
    <TouchableWithoutFeedback {...{ onPress }}>
      <Box
        height={53}
        backgroundColor="primary"
        alignItems="center"
        justifyContent="center"
        borderRadius="l"
      >
        <Text fontSize={18} fontFamily="Medium" color="background">
          {title}
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default Button;
