import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";

import { Box, Icon, makeStyles, Text, Theme } from "../../components";

interface PopularItemProps {
  id: number;
  name: string;
  category: string;
  currentPrice: number;
  oldPrice?: number | null;
  image: string;
  onAdd: (id: number) => void;
}

const PopularItem = (props: PopularItemProps) => {
  const styles = useStyles();

  const { id, name, category, image, currentPrice, oldPrice, onAdd } = props;

  return (
    <Box flexDirection="row" marginRight="l" alignItems="center" mb="m">
      <Box position="relative" marginRight="l">
        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
        />

        <Box position="absolute" bottom={-10} right={-8}>
          <TouchableWithoutFeedback onPress={() => onAdd(id)}>
            <Box style={styles.button}>
              <Icon name="plus" color="#fff" size={16} />
            </Box>
          </TouchableWithoutFeedback>
        </Box>
      </Box>

      <Box>
        <Text style={styles.name}>{name}</Text>

        <Text style={styles.category}>{category}</Text>

        <Box flexDirection="row">
          <Text style={styles.newPrice}>৳{currentPrice}</Text>

          {oldPrice && <Text style={styles.oldPrice}>৳{oldPrice}</Text>}
        </Box>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  image: { width: 82, height: 82, borderRadius: 12 },
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

export default PopularItem;
