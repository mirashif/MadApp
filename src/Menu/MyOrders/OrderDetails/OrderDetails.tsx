import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

import Item from "./Item";
import TrackOrder from "./TrackOrder";

const OrderSummaryItem = ({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color?: string;
}) => (
  <Box
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    style={{ marginBottom: 6 }}
  >
    <Text style={{ color: color || "#111111" }}>{title}</Text>
    <Text style={{ color: color || "#8A8A8A" }}>
      <CurrencyFormat value={description} />
    </Text>
  </Box>
);

const OrderDetails = () => {
  const theme = useTheme();
  const styles = useStyles();

  const insets = useSafeAreaInsets();

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
