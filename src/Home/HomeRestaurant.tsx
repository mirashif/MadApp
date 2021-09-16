import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, Image, TouchableWithoutFeedback } from "react-native";

import type { Theme } from "../components";
import { Box, Icon, makeStyles, useTheme } from "../components";
import type { ItemWithAvailabilityType } from "../state/store/ItemStore";
import type { RestaurantWithAvailabilityType } from "../state/store/RestaurantStore";

import Item from "./Item";

interface HomeRestaurantProps {
  restaurant: RestaurantWithAvailabilityType;
  items: ItemWithAvailabilityType[];
  onItemPress: (item: ItemWithAvailabilityType) => void;
}

const HomeRestaurant = ({
  items,
  restaurant,
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
          <Image
            style={styles.logoStyle}
            source={{ uri: restaurant.logoImageURI }}
          />
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
