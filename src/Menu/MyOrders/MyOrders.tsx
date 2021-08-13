import React from "react";
import { ScrollView } from "react-native-gesture-handler";

import {
  Box,
  HeaderBar,
  makeStyles,
  SafeArea,
  Theme,
  Text,
} from "../../components";
import { RootStackProps } from "../../components/AppNavigator";

import Item from "./Item";
import NoOrders from "./NoOrders";

const orders = [
  {
    id: "1",
    restaurant: "Cheez",
    price: 829.0,
    date: "July 10th, 2021",
    status: "Active",
  },
  {
    id: "2",
    restaurant: "Cheez",
    price: 619.0,
    date: "July 9th, 2021",
    status: "Delivered",
  },
  {
    id: "3",
    restaurant: "Cheez",
    price: 419.0,
    date: "July 9th, 2021",
    status: "Cancelled",
  },
];

const MyOrders = ({ navigation }: RootStackProps<"MenuStack">) => {
  const styles = useStyles();

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
            <Box style={styles.notice}>
              <Text color="primary">You earn cashback from every order!</Text>
            </Box>

            <Box px="screen" py="l">
              {orders.map((item) => (
                <Item
                  key={item.id}
                  {...{ ...item }}
                  onPress={() =>
                    navigation.navigate("MenuStack", {
                      screen: "OrderProcessing",
                    })
                  }
                />
              ))}
            </Box>
          </>
        )}
      </ScrollView>
    </SafeArea>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  notice: {
    borderRadius: theme.borderRadii.l,
    marginHorizontal: theme.spacing.screen,
    paddingHorizontal: 18,
    backgroundColor: "#FFE5EA",
    height: 51,
    justifyContent: "center",
  },
}));

export default MyOrders;
