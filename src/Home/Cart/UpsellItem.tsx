import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";

import type { Theme } from "../../components";
import { Box, Icon, makeStyles, Text } from "../../components";
import type { Item } from "../../state/store/ItemStore";

interface UpsellItemProps {
  item: Item;
  onAdd: (id: string) => void;
}

const UpsellItem = (props: UpsellItemProps) => {
  const styles = useStyles();

  const { item, onAdd } = props;

  return (
    <Box flexDirection="row" marginRight="l" alignItems="center" mb="m">
      <Box position="relative" marginRight="l">
        <TouchableWithoutFeedback onPress={() => onAdd(item.data.id)}>
          <Image
            source={{
              uri: item.data.thumbnailURI,
            }}
            style={styles.image}
          />
        </TouchableWithoutFeedback>

        <Box position="absolute" bottom={-10} right={-8}>
          <TouchableWithoutFeedback onPress={() => onAdd(item.data.id)}>
            <Box style={styles.button}>
              <Icon name="plus" color="#fff" size={16} />
            </Box>
          </TouchableWithoutFeedback>
        </Box>
      </Box>

      <Box>
        <Text style={styles.name}>{item.data.name}</Text>

        {item.category && (
          <Text style={styles.category}>{item.category?.data.name}</Text>
        )}

        <Box flexDirection="row">
          <Text style={styles.newPrice}>৳{item.price}</Text>

          {item.price !== item.originalPrice && (
            <Text style={styles.oldPrice}>৳{item.originalPrice}</Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    width: 82,
    height: 82,
    borderRadius: 12,
    backgroundColor: theme.colors.gray,
  },
  button: {
    height: 34,
    width: 34,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
  },
  name: { fontFamily: "Bold", color: "#212121" },
  category: { fontSize: 12, color: "#8A8A8A", marginVertical: 6 },
  newPrice: { fontSize: 11, color: "#111111" },
  oldPrice: {
    fontSize: 11,
    color: "#8A8A8A",
    marginLeft: 4,
    textDecorationLine: "line-through",
  },
}));

export default UpsellItem;
