import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import Icon from "./Icon";
import { Box, Text } from "./theme";

interface HeaderBarProps {
  title: string;
  hideBackButton?: boolean;
  onBackPress?: () => void;
}

const HeaderBar = ({
  title,
  onBackPress,
  hideBackButton = false,
}: HeaderBarProps) => {
  const navigation = useNavigation();

  const handleBackPress = () =>
    onBackPress ? onBackPress() : navigation.goBack();

  return (
    <Box px="screen" py="xl" flexDirection="row" alignItems="center">
      {!hideBackButton && (
        <TouchableWithoutFeedback onPress={handleBackPress}>
          <Icon name="arrow-left" size={24} />
        </TouchableWithoutFeedback>
      )}
      <Text px="l" style={{ fontSize: 24, fontFamily: "Medium" }}>
        {title}
      </Text>
    </Box>
  );
};

export default HeaderBar;
