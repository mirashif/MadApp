import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, Image, TouchableWithoutFeedback } from "react-native";

import type { Theme } from "../components";
import { Box, Icon, makeStyles, useTheme } from "../components";
import type { RootStackProps } from "../components/AppNavigator";
import type { Item as IItem } from "../state/store/ItemStore";
import type { RestaurantType } from "../state/store/RestaurantStore";

import Item from "./Item";

interface HomeRestaurantProps {
  restaurant: RestaurantType;
  items: IItem[];
  onItemPress: (itemId: string) => void;
}

const RestaurantMenu = ({
  items,
  restaurant,
  onItemPress,
}: HomeRestaurantProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const navigation = useNavigation<RootStackProps<"HomeStack">["navigation"]>();
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
        onPress={() =>
          navigation.navigate("HomeStack", {
            screen: "Restaurant",
            params: { restaurantId: restaurant.id, target: null },
          })
        }
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
          <Item item={item} onItemPress={onItemPress} />
        </Box>
      ))}
    </ScrollView>
  );
};

export default RestaurantMenu;

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
    backgroundColor: "white",
  },
}));
