import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

import { Box, useTheme } from "./theme";
import Button from "./Button";
import Icon from "./Icon";

interface ModalProps {
  visible: boolean;
  children: React.ReactNode;
  buttonTitle?: string;
  onButtonPress?: () => void;
  onBackPress?: () => void;
  onRequestClose: () => void;
}

const CustomModal = ({
  visible,
  children,
  onRequestClose,
  buttonTitle,
  onButtonPress,
  onBackPress,
}: ModalProps) => {
  const theme = useTheme();
  const windowWidth = Dimensions.get("window").width;

  return (
    <Modal {...{ visible, onRequestClose }} transparent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Box
          flex={1}
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.17)" }}
        >
          <Box
            width={windowWidth - theme.spacing.screen * 2}
            backgroundColor="background"
            borderRadius="l"
            style={{ paddingHorizontal: 22, paddingTop: 18, paddingBottom: 26 }}
          >
            {onBackPress && (
              <TouchableWithoutFeedback onPress={onBackPress}>
                <Icon name="arrow-left" size={24} />
              </TouchableWithoutFeedback>
            )}

            {children}

            {buttonTitle && onButtonPress && (
              <Button onPress={onButtonPress} size="lg">
                {buttonTitle}
              </Button>
            )}
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomModal;
