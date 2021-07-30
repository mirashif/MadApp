import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import { makeStyles, Text, Theme, useTheme } from "./theme";

interface ButtonProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const Button = (props: ButtonProps) => {
  const {
    size = "md",
    variant = "primary",
    children,
    disabled,
    style,
    ...rest
  } = props;
  const styles = useStyles();
  const theme = useTheme();

  let backgroundColor, color, height, fontSize, fontFamily;

  if (disabled) {
    backgroundColor = theme.colors.lightGray;
    color = theme.colors.primaryContrast;
  } else {
    switch (variant) {
      case "secondary":
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
      fontFamily = "Normal";
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
    fontFamily,
  };
  const borderStyles =
    variant === "secondary" && !disabled && styles.borderStyles;

  return (
    <RectButton
      enabled={!disabled}
      style={[styles.button, buttonStyle, borderStyles, style]}
      {...rest}
    >
      <Text
        selectable={false}
        numberOfLines={1}
        style={[styles.label, textStyle]}
      >
        {children}
      </Text>
    </RectButton>
  );
};

export default Button;

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    alignItems: "center",
    backgroundColor: "pink",
    borderRadius: theme.borderRadii.l,
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
  },
}));
