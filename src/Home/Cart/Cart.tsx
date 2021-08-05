import React from "react";
import { ScrollView, TouchableWithoutFeedback } from "react-native";

import {
  Box,
  HeaderBar,
  Icon,
  makeStyles,
  SafeArea,
  Text,
  useTheme,
} from "../../components";
import LocationBar from "../LocationBar";

import OrderItem from "./OrderItem";
import PopularItem from "./PopularItem";

const orderItems = [
  {
    id: "1",
    name: "SMG Pizza",
    addons:
      "Cheese, Extra Mushroom, Tomato, Samosa, Black Pepper, Sand Paper, Taylor Swift, Jalapenos, Blue Cheese",
    price: 669,
    image: "https://source.unsplash.com/MqT0asuoIcU/114x114/",
    quantity: 100,
  },
  {
    id: "2",
    name: "SMG Pizza",
    addons: "Permission Cheese",
    price: 669,
    image: "https://source.unsplash.com/MqT0asuoIcU/114x114/",
    quantity: 1,
  },
];

const popularItems = [...Array(6)].map((_, id) => {
  return {
    id,
    image: "https://source.unsplash.com/collection/8592813/82x82",
    name: "Burnt Cheezcake",
    category: "Dessert",
    currentPrice: 350,
    oldPrice: 399,
  };
});

const Cart = () => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <SafeArea>
      <HeaderBar title="Checkout" />

      <LocationBar address="5 Rd No. 2/3, Dhaka 1213" label="Scratchboard" />

      <Box px={"screen"}>
        <Box style={{ marginTop: 33 }}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          {orderItems.map((item) => (
            <OrderItem
              key={item.id}
              {...{ ...item }}
              onDelete={() => null}
              onDecrease={() => null}
              onIncrease={() => null}
            />
          ))}

          <TouchableWithoutFeedback onPress={() => null}>
            <Box flexDirection="row" alignItems="center" marginTop="s">
              <Icon name="x-circle" color={theme.colors.primary} />
              <Text marginLeft="s" color="primary" fontSize={12}>
                Clear Cart
              </Text>
            </Box>
          </TouchableWithoutFeedback>
        </Box>
      </Box>

      <Box style={{ marginTop: 40 }}>
        <Box px="screen">
          <Text style={styles.sectionTitle}>Popular with your order</Text>
        </Box>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.screen,
          }}
        >
          {popularItems.map((item) => (
            <PopularItem key={item.id} {...{ ...item }} onAdd={() => null} />
          ))}
        </ScrollView>
      </Box>
    </SafeArea>
  );
};

const useStyles = makeStyles(() => ({
  sectionTitle: {
    color: "#8A8A8A",
    fontSize: 18,
    marginBottom: 21,
  },
}));

export default Cart;
