import React from "react";
import type { StyleProp, TextStyle } from "react-native";
import { TextInput } from "react-native";

import { Box, Text } from "./theme";

interface InputProps {
  style?: StyleProp<TextStyle>;
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText: (vale: string) => void;
}

const Input = ({
  placeholder,
  onChangeText,
  label,
  style,
  value,
}: InputProps) => {
  return (
    <Box>
      {label && (
        <Text mb="m" fontFamily="Medium">
          {label}
        </Text>
      )}

      <TextInput
        onChangeText={(_value) => onChangeText(_value)}
        placeholder={placeholder}
        value={value}
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
