import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View, TouchableWithoutFeedback } from "react-native";

import type { Theme } from "./theme";
import { makeStyles, Text, useTheme } from "./theme";

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onPress: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  style?: StyleProp<ViewStyle>;
  variant?: "contained" | "outlined" | "text";
}

const Button = (props: ButtonProps) => {
  const {
    children,
    disabled,
    onPress,
    size = "md",
    style,
    variant = "contained",
  } = props;
  const styles = useStyles();
  const theme = useTheme();

  let backgroundColor, color, height, fontSize, fontFamily;

  if (disabled) {
    backgroundColor = theme.colors.lightGray;
    color = theme.colors.primaryContrast;
  } else {
    switch (variant) {
      case "text":
        backgroundColor = "transparent";
        color = theme.colors.primary;
        break;
      case "outlined":
        backgroundColor = theme.colors.primaryContrast;
        color = theme.colors.primary;
        break;
      default:
        backgroundColor = theme.colors.primary;
        color = theme.colors.primaryContrast;
        break;
    }
  }

  switch (size) {
    case "sm":
      height = 38;
      fontSize = 14;
      fontFamily = "Medium";
      break;
    case "lg":
      height = 52;
      fontSize = 18;
      fontFamily = "Bold";
      break;
    case "xl":
      height = 58;
      fontSize = 18;
      fontFamily = "Bold";
      break;
    default:
      height = 42;
      fontSize = 16;
      fontFamily = "Normal";
      break;
  }

  const buttonStyle = {
    backgroundColor,
    height,
  };
  const textStyle = {
    color,
    fontSize,
    fontFamily: variant === "text" ? "Bold" : fontFamily,
  };
  const borderStyles =
    variant === "outlined" && !disabled && styles.borderStyles;

  return (
    <View style={borderStyles}>
      <TouchableWithoutFeedback {...{ disabled: disabled, onPress }}>
        <View style={[styles.button, buttonStyle, style]}>
          <Text
            selectable={false}
            numberOfLines={1}
            style={[styles.label, textStyle]}
          >
            {children}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Button;

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    alignItems: "center",
    backgroundColor: "pink",
    borderRadius: theme.borderRadii.l,
    paddingHorizontal: 30,
    height: 42,
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
  borderStyles: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadii.l,
  },
}));
