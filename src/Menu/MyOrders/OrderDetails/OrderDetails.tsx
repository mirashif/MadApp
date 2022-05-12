import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

import {
  Box,
  Button,
  CurrencyFormat,
  HeaderBar,
  makeStyles,
  SafeArea,
  Text,
  useTheme,
} from "../../../components";
import LocationBar from "../../../Home/LocationBar";
import TakaIcon from "../../../Home/Checkout/assets/taka.svg";
import type { MenuStackProps } from "../..";
import { useAppState } from "../../../state/StateContext";
import type { OrderStore } from "../../../state/store/OrderStore";

import Item from "./Item";
import TrackOrder from "./TrackOrder";
import { OrderSummaryItem } from "./OrderSummaryItem";

const OrderDetails = () => {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const route = useRoute<MenuStackProps<"OrderDetails">["route"]>();
  const orderId = route.params?.orderId;

  const orders: OrderStore = useAppState("orders");

  const order = orders.get(orderId);
  const displayText = order?.data.displayText;
  const timeLeft = order?.data.timeLeft;
  const orderNumber = order?.data.orderNumber;
  const addressLine = order?.data.address.address;
  const addressLabel = order?.data.address.label;
  const totalAmount = order?.data.payments.grandTotalAmount;
  const stage: "waiting" | "preparing" | "delivering" | "complete" =
    order?.triStage;

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="Order Details" />

        <TrackOrder />

        <Box style={{ paddingHorizontal: 32 }}>
          <Box style={{ marginTop: 16 }}>
            <Text fontSize={18} style={{ color: "#B0B0B0" }}>
              Order#
            </Text>

            <Text
              fontSize={34}
              fontFamily="Bold"
              color="primary"
              style={{ marginTop: 1 }}
            >
              25809
            </Text>
          </Box>

          <Box style={{ marginTop: 19 }}>
            <Item />
            <Item />
          </Box>

          <Box style={{ marginTop: 31 }}>
            <Text fontFamily="Normal" fontSize={18}>
              Special Instructions
            </Text>

            <Text
              style={{
                color: "#939393",
                fontFamily: "Normal",
              }}
            >
              Please do not include vegetables in my meal
            </Text>
          </Box>

          <Box style={{ marginTop: 28 }}>
            <Text style={styles.sectionTitle}>DELIVERED TO</Text>
            <LocationBar />
          </Box>

          <Box style={{ marginTop: 51 }}>
            <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
            <Box mt="l" flexDirection="row" alignItems="center">
              <TakaIcon />
              <Text ml="l" fontFamily="Normal">
                Cash On Delivery
              </Text>
            </Box>
          </Box>

          <Box style={{ marginTop: 26 }}>
            <OrderSummaryItem title="Subtotal" description="769.00" />
            <OrderSummaryItem title="Delivery fee" description="30.00" />
            <OrderSummaryItem
              title="Discount"
              description="- 20"
              color={theme.colors.primary}
            />
          </Box>

          <Box style={{ marginTop: 42 }}>
            <Text style={styles.sectionTitle}>TOTAL AMOUNT</Text>
            <Text fontSize={34} fontFamily="Bold" color="primary">
              <CurrencyFormat value={2809} />
            </Text>
          </Box>

          <Button
            style={{ marginTop: 22, marginBottom: 19 + insets.bottom }}
            size="lg"
            onPress={() => null}
          >
            Reorder
          </Button>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

const useStyles = makeStyles(() => ({
  sectionTitle: {
    fontSize: 18,
    color: "#B0B0B0",
    marginBottom: 3,
  },
}));

export default OrderDetails;
