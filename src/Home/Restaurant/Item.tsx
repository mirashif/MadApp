import React from "react";
import { Image } from "react-native";

import { Box, Text, useTheme } from "../../components";

export interface ItemProps {
  image: string;
  name: string;
  price: string;
}

const Item = ({ image, name, price }: ItemProps) => {
  const theme = useTheme();

  return (
    <Box
      style={{
        margin: 8,
      }}
    >
      <Image
        style={{
          height: 150,
          width: 150,
          borderRadius: 12,
          marginBottom: 7,
        }}
        source={{ uri: image }}
      />
      <Text
        numberOfLines={1}
        style={{
          fontFamily: "Bold",
          fontSize: 11,
          color: theme.colors.foreground,
        }}
      >
        {name}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: "Normal",
          fontSize: 11,
          color: theme.colors.darkGray,
        }}
      >
        {price}
      </Text>
    </Box>
  );
};

export default Item;
