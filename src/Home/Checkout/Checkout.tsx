import React, { useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Theme } from "../../components";
import {
  CurrencyFormat,
  Box,
  HeaderBar,
  makeStyles,
  SafeArea,
  Text,
} from "../../components";
import DissmissKeyboard from "../../components/DissmissKeyboard";
import { CheckoutButton } from "../Cart/Button";
import LocationBar from "../LocationBar";

import PaymentMethodItem from "./PaymentMethodItem";

const summary = [
  {
    quantity: 2,
    restaurant: "Cheez",
    name: "Cheezburger",
    price: "829.00",
  },
  {
    quantity: 1,
    restaurant: "Cheez",
    name: "Beef Shorisha",
    price: "126.00",
  },
  {
    quantity: 1,
    restaurant: "Madchef",
    name: "Cajun Fries",
    price: "666.00",
  },
];

const Checkout = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "cod" | "card">(
    "bkash"
  );

  return (
    <SafeArea>
      <DissmissKeyboard>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 17 }}
        >
          <HeaderBar title="Checkout" />

          <LocationBar editMode onEditPress={undefined} />

          <Box style={{ marginTop: 32 }}>
            <Text style={styles.title}>Payment method</Text>

            <PaymentMethodItem
              type="bkash"
              active={paymentMethod === "bkash"}
              onPress={() => setPaymentMethod("bkash")}
            />

            <PaymentMethodItem
              type="cod"
              active={paymentMethod === "cod"}
              onPress={() => setPaymentMethod("cod")}
            />

            <PaymentMethodItem
              type="card"
              active={paymentMethod === "card"}
              onPress={() => setPaymentMethod("card")}
            />
          </Box>

          <Box style={{ marginTop: 56 }}>
            <Text style={styles.title}>Order Summary</Text>

            {summary.map(({ quantity, restaurant, name, price }, index) => (
              <Box
                key={index}
                flexDirection="row"
                px="screen"
                justifyContent="space-between"
              >
                <Text style={{ color: "#939393", lineHeight: 24 }}>
                  {quantity}x {restaurant}: {name}
                </Text>

                <Text>
                  <CurrencyFormat value={price} />
                </Text>
              </Box>
            ))}
          </Box>

          <Box mx="screen" style={{ marginTop: 45 }}>
            <TextInput
              style={styles.input}
              placeholder="Special Instructions"
            />
          </Box>
        </ScrollView>

        <Box
          mx="screen"
          style={{
            marginBottom: 17 + insets.bottom,
            paddingTop: 17,
          }}
        >
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Text fontFamily="Normal" fontSize={18}>
                Total
              </Text>
              <Text
                fontFamily="Normal"
                fontSize={11}
                style={{ color: "#BBBBBB" }}
              >
                VAT included
              </Text>
            </Box>

            <Text fontFamily="Normal" fontSize={18}>
              ৳829.00
            </Text>
          </Box>

          <Box style={{ marginTop: 27 }}>
            <CheckoutButton label="Place Order" onPress={() => null} />
          </Box>
        </Box>
      </DissmissKeyboard>
    </SafeArea>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontFamily: "Normal",
    fontSize: 18,
    marginBottom: 14,
    paddingHorizontal: theme.spacing.screen,
  },
  input: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: 12,
  },
}));

export default Checkout;
