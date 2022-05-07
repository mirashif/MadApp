import { observer } from "mobx-react";
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
import { useAppState } from "../../state/StateContext";
import type { CartableWrapper, CartStore } from "../../state/store/CartStore";
import { CheckoutButton } from "../Cart/Button";
import LocationBar from "../LocationBar";

import PaymentMethodItem from "./PaymentMethodItem";

const Checkout = observer(() => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  const cart: CartStore = useAppState("cart");
  const cartItems: CartableWrapper[] = cart.all;

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

            {cartItems.map((item) => (
              <Box
                key={item.itemID}
                flexDirection="row"
                px="screen"
                justifyContent="space-between"
              >
                <Text style={{ color: "#939393", lineHeight: 24 }}>
                  {item.count}x: {item.itemName}
                </Text>

                <Text>
                  <CurrencyFormat value={item.totalPrice} />
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
          style={{
            marginBottom: 17 + insets.bottom,
            paddingTop: 17,
          }}
        >
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            style={{
              paddingHorizontal: 40,
            }}
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
              <CurrencyFormat value={cart.grandTotalAmount} />
            </Text>
          </Box>

          <Box mx="screen" style={{ marginTop: 27 }}>
            <CheckoutButton label="Place Order" onPress={() => null} />
          </Box>
        </Box>
      </DissmissKeyboard>
    </SafeArea>
  );
});

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
