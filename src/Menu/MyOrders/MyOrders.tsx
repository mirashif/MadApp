import React from "react";
import { ScrollView } from "react-native-gesture-handler";

import { Box, HeaderBar, SafeArea } from "../../components";
import type { RootStackProps } from "../../components/AppNavigator";
import { useAppState } from "../../state/StateContext";
import type {
  OrderStore,
  OrderPage,
  Order,
} from "../../state/store/OrderStore";

import ActiveOrderItem from "./ActiveOrderItem";
import CashbackNotice from "./CashbackNotice";
import NoOrders from "./NoOrders";
import PastOrderItem from "./PastOrderItem";


const MyOrders = ({ navigation }: RootStackProps<"MenuStack">) => {
  const orders: OrderStore = useAppState("orders");

  const pages: OrderPage[] = orders.pages;
  const order: Order = pages[i].all;
  const orderRestaurantName: string = order.restaurantNames.join(" x ");

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="My Orders" />

        {orders.length === 0 && (
          <Box style={{ marginTop: 127 }}>
            <NoOrders
              onCTAPress={() =>
                navigation.navigate("BottomTabs", { screen: "Home" })
              }
            />
          </Box>
        )}

        {orders.length > 0 && (
          <>
            <CashbackNotice />

            <ActiveOrderItem
              onPress={() =>
                navigation.navigate("MenuStack", { screen: "OrderProcessing" })
              }
            />

            <Box
              height={1}
              style={{
                marginHorizontal: 32,
                backgroundColor: "#F2F2F2",
                marginBottom: 30,
              }}
            />

            <PastOrderItem
              variant="CANCELLED"
              onPress={() => null}
              onCTAPress={() => null}
            />

            <PastOrderItem
              variant="DELIVERED"
              onCTAPress={() => null}
              onPress={() =>
                navigation.navigate("MenuStack", { screen: "OrderDetails" })
              }
            />
          </>
        )}
      </ScrollView>
    </SafeArea>
  );
};

export default MyOrders;
