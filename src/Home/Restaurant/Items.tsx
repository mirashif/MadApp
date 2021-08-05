import React from "react";

import { Box, Text, useTheme } from "../../components";

import Item, { ItemProps } from "./Item";

interface ItemsProps {
  name: string;
  items: ItemProps[];
}

const Items = ({ name, items }: ItemsProps) => {
  const theme = useTheme();

  return (
    <Box
      style={{
        marginHorizontal: theme.spacing.screen,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: "Normal",
          color: theme.colors.foreground,
          marginBottom: 4,
          marginHorizontal: 8,
        }}
      >
        {name}
      </Text>
      <Box
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {items.map((item, index) => (
          <Item {...item} key={index} />
        ))}
      </Box>
    </Box>
  );
};

export default Items;
