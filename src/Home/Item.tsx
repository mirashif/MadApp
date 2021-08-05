import React from "react";
import { ImageBackground } from "react-native";

import { Box, Icon, makeStyles, Text, Theme, useTheme } from "../components";

export interface ItemProps {
  id: number | string;
  discount?: string;
  name: string;
  previousPrice?: string;
  price: string;
  imageUri: string;
}

const Item = ({
  discount,
  name,
  previousPrice,
  price,
  imageUri,
}: ItemProps) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Box>
      <ImageBackground
        style={styles.imageView}
        imageStyle={styles.imageStyle}
        source={{ uri: imageUri }}
      >
        {discount && (
          <Box style={styles.discount}>
            <Text style={styles.discountText}>{discount}</Text>
          </Box>
        )}
        <Box style={styles.addCartIcon}>
          <Icon size={18} name="plus" color={theme.colors.primaryContrast} />
        </Box>
      </ImageBackground>

      <Text style={styles.name}>{name}</Text>
      <Box style={styles.price}>
        <Text style={styles.currentPrice}>{price}</Text>
        {previousPrice && (
          <Text style={styles.previousPrice}>{previousPrice}</Text>
        )}
      </Box>
    </Box>
  );
};

export default Item;

const useStyles = makeStyles((theme: Theme) => ({
  imageView: {
    width: 120,
    height: 120,
    position: "relative",
    marginBottom: 5,
  },
  imageStyle: {
    borderRadius: theme.borderRadii.l,
  },
  discount: {
    position: "absolute",
    top: 12,
    left: 0,
    backgroundColor: theme.colors.primary,
    height: 12,
    width: 62,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  discountText: {
    fontFamily: "Normal",
    fontSize: 9,
    color: theme.colors.primaryContrast,
  },
  addCartIcon: {
    position: "absolute",
    bottom: -9,
    right: -9,
    height: 34,
    width: 34,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  name: {
    fontFamily: "Bold",
    fontSize: 11,
    color: theme.colors.foreground,
  },
  price: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currentPrice: {
    fontFamily: "Normal",
    fontSize: 10,
    marginRight: 5,
    color: theme.colors.darkGray,
  },
  previousPrice: {
    fontFamily: "Normal",
    fontSize: 7,
    color: theme.colors.gray,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
}));
