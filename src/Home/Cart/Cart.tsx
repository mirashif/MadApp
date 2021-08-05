import React from "react";
import { TouchableWithoutFeedback } from "react-native";

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
