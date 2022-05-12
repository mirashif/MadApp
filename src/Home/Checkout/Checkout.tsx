import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
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
import type { RootStackProps } from "../../components/AppNavigator";
import DissmissKeyboard from "../../components/DissmissKeyboard";
import { useAppState } from "../../state/StateContext";
import type { CartableWrapper, CartStore } from "../../state/store/CartStore";
import { CheckoutButton } from "../Cart/Button";
import LocationBar from "../LocationBar";

import PaymentMethodItem from "./PaymentMethodItem";

type PaymentMethodType = "cash-on-delivery" | "bkash" | "card";

const Checkout = observer(() => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RootStackProps<"MenuStack">["navigation"]>();

  const cart: CartStore = useAppState("cart");
  const cartItems: CartableWrapper[] = cart.all;
  const paymentMethod: PaymentMethodType = cart.paymentMethod;

  const handlePlaceOrder = async () => {
    try {
      // const orderId = await cart.placeOrder();
      // if (orderId)
      navigation.navigate("MenuStack", {
        screen: "OrderProcessing",
        params: { orderId: "123" },
        // TODO: Fix orderId type
      });
    } catch (error) {
      console.error(error);
    }
  };

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
              onPress={() =>
                cart.selectPaymentMethod("bkash" as PaymentMethodType)
              }
            />
            <PaymentMethodItem
              type="cod"
              active={paymentMethod === "cash-on-delivery"}
              onPress={() =>
                cart.selectPaymentMethod(
                  "cash-on-delivery" as PaymentMethodType
                )
              }
            />
            <PaymentMethodItem
              type="card"
              active={paymentMethod === "card"}
              onPress={() =>
                cart.selectPaymentMethod("card" as PaymentMethodType)
              }
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
              value={cart.specialInstructions}
              onChangeText={cart.setSpecialInstructions}
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
            <CheckoutButton label="Place Order" onPress={handlePlaceOrder} />
          </Box>
        </Box>
      </DissmissKeyboard>
    </SafeArea>
  );
});

export default Checkout;

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
