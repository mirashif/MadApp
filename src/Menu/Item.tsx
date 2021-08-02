import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Text, useTheme } from "../components";

interface ItemProps {
  icon: string;
  label: string;
}

const Item = ({ icon, label, ...otherProps }: ItemProps) => {
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback {...otherProps}>
      <Box
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 50,
          borderRadius: theme.borderRadii.l,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "rgba(239, 239, 239, 0.38)",
          paddingHorizontal: theme.spacing.xl,
          marginBottom: theme.spacing.m,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            marginRight: theme.spacing.m,
          }}
        >
          {icon}
        </Text>
        <Text
          style={{
            fontFamily: "Normal",
            fontSize: 14,
            color: theme.colors.foreground,
          }}
        >
          {label}
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default Item;
