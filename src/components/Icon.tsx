import React from "react";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

import { useTheme } from "./theme";

interface IconProps {
  name: React.ComponentProps<typeof Feather>["name"];
  size?: number;
  color?: string;
}

const Icon = (props: IconProps) => <Feather {...props} />;
export default Icon;

export const CircularIcon = ({
  name,
  size = 34,
  backgroundColor,
  color,
  ...otherProps
}: IconProps & { backgroundColor?: string }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        height: size,
        width: size,
        borderRadius: size,
        backgroundColor: backgroundColor
          ? backgroundColor
          : theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
      {...otherProps}
    >
      <Icon
        {...{
          name,
          size: size / 2,
          color: color || theme.colors.primaryContrast,
        }}
      />
    </View>
  );
};
