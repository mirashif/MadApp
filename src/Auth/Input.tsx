import React from "react";
import { TextInput } from "react-native";

interface InputProps {
  placeholder?: string;
  onChange: (vale: string) => void;
}

const Input = ({ placeholder, onChange }: InputProps) => {
  return (
    <TextInput
      onChangeText={(value) => onChange(value)}
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
