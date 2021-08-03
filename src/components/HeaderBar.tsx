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
    <Box>
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} />
      </TouchableWithoutFeedback>
      <Text>{title}</Text>
    </Box>
  );
};

export default HeaderBar;
