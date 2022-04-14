import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

import { Box, useTheme, Text } from "./theme";
import Button from "./Button";
import Icon from "./Icon";

interface ModalProps {
  visible: boolean;
  children: React.ReactNode;
  title?: string;
  buttonTitle?: string;
  buttonDisabled?: boolean;
  onButtonPress?: () => void;
  onBackPress?: () => void;
  onRequestClose: () => void;
}

const CustomModal = ({
  visible,
  children,
  onRequestClose,
  buttonTitle,
  title,
  onButtonPress,
  onBackPress,
  buttonDisabled = false,
}: ModalProps) => {
  const theme = useTheme();
  const windowWidth = Dimensions.get("window").width;

  return (
    <Modal {...{ visible, onRequestClose }} transparent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={onRequestClose}>
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
              style={{
                paddingHorizontal: 22,
                paddingTop: 18,
                paddingBottom: 26,
              }}
            >
              {onBackPress && (
                <Box flexDirection="row" alignItems="center">
                  <TouchableWithoutFeedback onPress={onBackPress}>
                    <Icon name="arrow-left" size={24} />
                  </TouchableWithoutFeedback>

                  <Text ml="m" fontSize={24}>
                    {title}
                  </Text>
                </Box>
              )}

              {children}

              {buttonTitle && onButtonPress && (
                <Button
                  onPress={onButtonPress}
                  disabled={buttonDisabled}
                  size="lg"
                >
                  {buttonTitle}
                </Button>
              )}
            </Box>
          </Box>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomModal;
