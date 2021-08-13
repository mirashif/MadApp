import React from "react";
import { ScrollView } from "react-native-gesture-handler";

import { Box, HeaderBar, SafeArea } from "../../components";
import { RootStackProps } from "../../components/AppNavigator";

import ActiveOrderItem from "./ActiveOrderItem";
import CashbackNotice from "./CashbackNotice";
import NoOrders from "./NoOrders";
import PastOrderItem from "./PastOrderItem";

const orders = [
  {
    id: "1",
    restaurant: "Cheez",
    price: 829.0,
    date: "July 10th, 2021",
    status: "Active",
  },
];

const MyOrders = ({ navigation }: RootStackProps<"MenuStack">) => {
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

            <ActiveOrderItem />

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
