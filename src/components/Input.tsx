import React from "react";
import { StyleProp, TextStyle, TextInput } from "react-native";

import { Box, Text } from "./theme";

interface InputProps {
  style?: StyleProp<TextStyle>;
  label?: string;
  placeholder?: string;
  onChangeText: (vale: string) => void;
}

const Input = ({ placeholder, onChangeText, label, style }: InputProps) => {
  return (
    <Box>
      {label && (
        <Text mb="m" fontFamily="Medium">
          {label}
        </Text>
      )}

      <TextInput
        onChangeText={(value) => onChangeText(value)}
        placeholder={placeholder}
        style={[
          {
            borderColor: "#DDDDDD",
            borderWidth: 1,
            padding: 16,
            fontSize: 18,
            borderRadius: 12,
          },
          style,
        ]}
      />
    </Box>
  );
};

export default Input;
