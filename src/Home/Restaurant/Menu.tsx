import React from "react";
import { ScrollView, Image } from "react-native";

import { Box, Icon, makeStyles, Theme, useTheme } from "../../components";

import Item, { ItemProps } from "./Item";

interface MenuProps {
  logoUri: string;
  items: ItemProps[];
}

const Menu = ({ items, logoUri }: MenuProps) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.screen,
        marginBottom: theme.spacing.l,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <Box style={styles.logo}>
        <Image style={styles.logoStyle} source={{ uri: logoUri }} />
        <Icon name="arrow-right" />
      </Box>

      {items.map((item) => (
        <Box key={item.id} style={styles.restaurantItem}>
          <Item {...item} />
        </Box>
      ))}
    </ScrollView>
  );
};

export default Menu;

const useStyles = makeStyles((theme: Theme) => ({
  restaurantItem: {
    marginRight: theme.spacing.xl,
  },
  logo: {
    marginRight: theme.spacing.l,
    justifyContent: "center",
    alignItems: "center",
  },
  logoStyle: {
    width: 38,
    height: 65,
    resizeMode: "contain",
    marginBottom: theme.spacing.s,
  },
}));
