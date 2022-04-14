import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";

import { useTheme, Text, Box } from "../../components";
import type { Item as ItemType } from "../../state/store/ItemStore";

import type { IMeasurement } from "./constants";

interface ItemProps {
  item: ItemType;
  onItemPress: (itemId: string) => void;
  onMeasurement: (props: IMeasurement) => void;
}

const Item = ({ item, onItemPress, onMeasurement }: ItemProps) => {
  const theme = useTheme();

  const { thumbnailURI, name, price } = item.data;

  return (
    <TouchableWithoutFeedback onPress={() => onItemPress(item.id)}>
      <Box
        onLayout={({
          nativeEvent: {
            layout: { y },
          },
        }) => onMeasurement({ itemId: item.id, y })}
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
          {price.toLocaleString("en-IN")}
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default Item;
