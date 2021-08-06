import React from "react";
import { Dimensions, ScrollView } from "react-native";

import {
  Box,
  HeaderBar,
  makeStyles,
  SafeArea,
  Text,
  useTheme,
} from "../../components";
import LocationBar from "../LocationBar";

import OrderItem from "./OrderItem";
import PopularItem from "./PopularItem";
import { VoucherButton, ClearCartButton, CheckoutButton } from "./Button";
import OrderSummaryItem, { Discount } from "./Item";

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

  const windowWidth = Dimensions.get("window").width;

  return (
    <SafeArea>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        <HeaderBar title="Checkout" />

        <LocationBar address="5 Rd No. 2/3, Dhaka 1213" label="Scratchboard" />

        {/*Order Items*/}
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

            <Box mt="s">
              <ClearCartButton onPress={() => null} />
            </Box>
          </Box>
        </Box>

        {/*Popular Orders*/}
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

        {/*Order Summary & Voucher*/}
        <Box style={{ marginTop: 83, paddingLeft: 46, paddingRight: 38 }}>
          <OrderSummaryItem title="Subtotal" description="৳769" />
          <OrderSummaryItem title="Delivery fee" description="৳30" />

          <Box mt="m">
            <VoucherButton onPress={() => null} />
            <Discount amount={20} onDiscountCancel={() => null} />
          </Box>
        </Box>
      </ScrollView>

      {/*Total & Checkout*/}
      <Box
        position="absolute"
        bottom={0}
        width={windowWidth}
        backgroundColor="background"
        style={{ paddingTop: 22, paddingBottom: 16 }}
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ paddingLeft: 46, paddingRight: 38 }}
        >
          <Box>
            <Text style={{ fontSize: 18, color: "#111111" }}>Total</Text>
            <Text style={{ color: "#BBBBBB", fontSize: 11 }}>VAT included</Text>
          </Box>

          <Text style={{ fontSize: 18, color: "#111111" }}>৳829</Text>
        </Box>

        <Box style={{ alignItems: "center", marginTop: 27 }}>
          <CheckoutButton onPress={() => null} />
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
