import React from "react";
import type { StyleProp, TextInputProps, TextStyle } from "react-native";
import { TextInput } from "react-native";

import { Box, Text } from "./theme";

interface InputProps {
  style?: StyleProp<TextStyle>;
  label?: string;
  placeholder?: string;
  onChangeText: (vale: string) => void;
  value?: string;
  inputProps?: TextInputProps;
}

const Input = ({
  placeholder,
  onChangeText,
  label,
  style,
  inputProps,
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
        {...{ value, placeholder }}
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
        {...inputProps}
      />
    </Box>
  );
};

export default Input;
