import React from "react";
import { ScrollView } from "react-native";

import {
  Box,
  Button,
  HeaderBar,
  makeStyles,
  SafeArea,
  Text,
  useTheme,
} from "../../../components";
import LocationBar from "../../../Home/LocationBar";

import Item from "./Item";

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
    <Text style={{ color: color || "#8A8A8A" }}>{description}</Text>
  </Box>
);

const OrderDetails = () => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="Order Details" />

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

            <Text mt="m" fontSize={11} style={{ color: "#BBBBBB" }}>
              July 9th, 2021
            </Text>
          </Box>

          <Box style={{ marginTop: 19 }}>
            <Item />
            <Item />
          </Box>

          <Box style={{ marginTop: 46 }}>
            <OrderSummaryItem title="Subtotal" description="৳769.00" />
            <OrderSummaryItem title="Delivery fee" description="৳30.00" />
            <OrderSummaryItem
              title="Discount"
              description="- ৳20"
              color={theme.colors.primary}
            />
          </Box>

          <Box mt="l">
            <Text style={styles.sectionTitle}>DELIVERED TO</Text>
            <LocationBar address="5 Rd No. 2/3, Dhaka 1213" label="Office" />
          </Box>

          <Box style={{ marginTop: 26 }}>
            <Text style={styles.sectionTitle}>TOTAL AMOUNT</Text>
            <Text fontSize={34} fontFamily="Bold" color="primary">
              ৳ 2,809
            </Text>
          </Box>

          <Button
            style={{ marginTop: 22, marginBottom: 19 }}
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
