import React from "react";
import { Dimensions, ScrollView, TouchableWithoutFeedback } from "react-native";

import {
  Box,
  HeaderBar,
  Icon,
  makeStyles,
  SafeArea,
  Text,
  Theme,
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

const OrderSummaryItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Box
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    style={{ marginBottom: 6 }}
  >
    <Text style={{ color: "#111111" }}>{title}</Text>
    <Text style={{ color: "#8A8A8A" }}>{description}</Text>
  </Box>
);

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

          <TouchableWithoutFeedback onPress={() => null}>
            <Box alignItems="flex-end" mt="m">
              <Box style={styles.voucherButton}>
                <Icon name="percent" color={theme.colors.primary} />
                <Text color="primary" ml="m">
                  Apply a voucher
                </Text>
              </Box>
            </Box>
          </TouchableWithoutFeedback>
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
          <TouchableWithoutFeedback onPress={() => null}>
            <Box style={styles.checkoutButton}>
              <Text color="background" fontSize={17}>
                Checkout
              </Text>

              <Box style={{ position: "absolute", right: 18, top: 15 }}>
                <Icon name="chevron-right" size={24} color="#fff" />
              </Box>
            </Box>
          </TouchableWithoutFeedback>
        </Box>
      </Box>
    </SafeArea>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  sectionTitle: {
    color: "#8A8A8A",
    fontSize: 18,
    marginBottom: 21,
  },
  voucherButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 29,
    width: 158,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: theme.borderRadii.xl,
    justifyContent: "center",
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    height: 57,
    width: 358,
    borderRadius: theme.borderRadii.l,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default Cart;
