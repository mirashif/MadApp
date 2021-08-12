import React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Box } from ".";

interface DissmissKeyboardProps {
  children: React.ReactNode;
}

const DissmissKeyboard = ({ children }: DissmissKeyboardProps) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Box flex={1}>{children}</Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default DissmissKeyboard;
