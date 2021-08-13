import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, Image, TouchableWithoutFeedback } from "react-native";

import { Box, Icon, makeStyles, Theme, useTheme } from "../components";

import { IItem } from "./Home";
import Item from "./Item";

interface HomeRestaurantProps {
  logoUri: string;
  items: IItem[];
  onItemPress: (id: number | string) => void;
}

const HomeRestaurant = ({
  items,
  logoUri,
  onItemPress,
}: HomeRestaurantProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.screen,
        marginBottom: theme.spacing.l,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate("HomeStack", { screen: "Menu" })}
      >
        <Box style={styles.logo}>
          <Image style={styles.logoStyle} source={{ uri: logoUri }} />
          <Icon name="arrow-right" size={24} color="#000000" />
        </Box>
      </TouchableWithoutFeedback>

      {items.map((item) => (
        <Box key={item.id} style={styles.restaurantItem}>
          <Item {...{ ...item, onItemPress }} />
        </Box>
      ))}
    </ScrollView>
  );
};

export default HomeRestaurant;

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
