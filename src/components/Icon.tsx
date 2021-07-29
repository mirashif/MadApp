import React from "react";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

import { useTheme } from "./theme";

interface IconProps {
  name: React.ComponentProps<typeof Feather>["name"];
  size: number;
  color: string;
}

const Icon = (props: IconProps) => <Feather {...props} />;
export default Icon;

export const CircularIcon = ({ name, size }: IconProps) => {
  const theme = useTheme();

  return (
    <View
      style={{
        height: size,
        width: size,
        borderRadius: size,
        backgroundColor: theme.colors.primary,
      }}
    >
      <Icon
        {...{
          name,
          size: size / 2,
          color: theme.colors.primaryContrast,
        }}
      />
    </View>
  );
};
