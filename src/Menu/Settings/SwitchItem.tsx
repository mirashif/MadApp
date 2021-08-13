import React from "react";
import { Switch } from "react-native";

import { Text, useTheme } from "../../components";

import Item from "./Item";

interface SwitchItemProps {
  title: string;
  value: boolean;
  onValueChange: () => void;
}

const SwitchItem = ({ title, value, onValueChange }: SwitchItemProps) => {
  const theme = useTheme();

  return (
    <Item>
      <Text>{title}</Text>
      <Switch
        trackColor={{ false: "#DDDDDD", true: theme.colors.primary }}
        thumbColor="#fff"
        ios_backgroundColor="#DDDDDD"
        onValueChange={onValueChange}
        value={value}
      />
    </Item>
  );
};

export default SwitchItem;
