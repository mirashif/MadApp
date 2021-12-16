import React from "react";
import { View, Image } from "react-native";

import { useTheme, Text } from "../../components";

interface ItemProps {
  image: string;
  name: string;
  price: string;
}

const Item = ({ image, name, price }: ItemProps) => {
  const theme = useTheme();

  return (
    <View
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
    </View>
  );
};

export default Item;
