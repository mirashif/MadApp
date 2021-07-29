import React from "react";
import { Feather } from "@expo/vector-icons";

interface IconProps {
  name: React.ComponentProps<typeof Feather>["name"];
  size?: number;
  color?: string;
}

const Icon = ({ name, size = 24, color = "black", ...rest }: IconProps) => (
  <Feather name={name} size={size} color={color} {...rest} />
);

export default Icon;
