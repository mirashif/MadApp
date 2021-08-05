import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Icon, Text, useTheme } from "../../components";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Box
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing.l,
        paddingHorizontal: theme.spacing.xl,
      }}
    >
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="white" />
      </TouchableWithoutFeedback>
      <Text
        style={{
          fontFamily: "Bold",
          fontSize: 24,
          color: theme.colors.primaryContrast,
          marginLeft: theme.spacing.m,
        }}
      >
        {title}
      </Text>
    </Box>
  );
};

export default Header;
