import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";

import { useTheme, Text, Box } from "../../components";
import type { Item as ItemType } from "../../state/store/ItemStore";

interface ItemProps {
  item: ItemType;
  onItemPress: (item: ItemType) => void;
}

const Item = ({ item, onItemPress }: ItemProps) => {
  const theme = useTheme();

  const { thumbnailURI, name, price } = item.data;

  return (
    <TouchableWithoutFeedback onPress={() => onItemPress(item)}>
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
            backgroundColor: theme.colors.gray,
          }}
          source={{ uri: thumbnailURI }}
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
    </TouchableWithoutFeedback>
  );
};

export default Item;
