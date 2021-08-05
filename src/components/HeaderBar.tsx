import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import Icon from "./Icon";
import { Box, Text } from "./theme";

interface HeaderBarProps {
  title: string;
}

const HeaderBar = ({ title }: HeaderBarProps) => {
  const navigation = useNavigation();

  return (
    <Box px="screen" py="xl" flexDirection="row" alignItems="center">
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} />
      </TouchableWithoutFeedback>
      <Text px="l" style={{ fontSize: 24, fontFamily: "Medium" }}>
        {title}
      </Text>
    </Box>
  );
};

export default HeaderBar;
