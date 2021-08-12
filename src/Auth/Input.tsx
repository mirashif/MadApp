import React from "react";
import { TextInput } from "react-native";

interface InputProps {
  placeholder?: string;
  onChangeText: (vale: string) => void;
}

const Input = ({ placeholder, onChangeText }: InputProps) => {
  return (
    <TextInput
      onChangeText={(value) => onChangeText(value)}
      placeholder={placeholder}
      style={{
        borderColor: "#DDDDDD",
        borderWidth: 1,
        padding: 16,
        fontSize: 18,
        borderRadius: 12,
      }}
    />
  );
};

export default Input;
