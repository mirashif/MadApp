import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { HomeStackProps } from "..";
import { Box, CurrencyFormat, Text } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { CartStore } from "../../state/store/CartStore";

import { CheckoutButton } from "./Button";

const Total = observer(() => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeStackProps<"Cart">["navigation"]>();

  const windowWidth = Dimensions.get("window").width;

  const cart: CartStore = useAppState("cart");

  return (
    <Box
      position="absolute"
      bottom={0}
      width={windowWidth}
      backgroundColor="background"
      style={{ paddingTop: 22, paddingBottom: 16 + insets.bottom }}
    >
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ paddingHorizontal: 40 }}
      >
        <Box>
          <Text style={{ fontSize: 18 }}>Total</Text>
          <Text style={{ color: "#BBBBBB", fontSize: 11 }}>VAT included</Text>
        </Box>

        <Text style={{ fontSize: 18 }}>
          <CurrencyFormat value={cart.grandTotalAmount} />
        </Text>
      </Box>

      <Box style={{ alignItems: "center", marginTop: 27 }}>
        <CheckoutButton onPress={() => navigation.navigate("Checkout")} />
      </Box>
    </Box>
  );
});

export default Total;
