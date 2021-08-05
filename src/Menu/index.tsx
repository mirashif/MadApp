import React from "react";
import { RouteProp } from "@react-navigation/native";
import {
  StackNavigationProp,
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import MyOrders from "./MyOrders/MyOrders";
import OrderProcessing from "./OrderProcessing/OrderProcessing";

export { default as Menu } from "./Menu";

export type MenuStackProps<RouteName extends keyof MenuStackParamList> = {
  navigation: StackNavigationProp<MenuStackParamList, RouteName>;
  route: RouteProp<MenuStackParamList, RouteName>;
};

export type MenuStackParamList = {
  MyOrders: undefined;
  OrderProcessing: undefined;
};

const MenuStack = createStackNavigator<MenuStackParamList>();

export const MenuNavigator = () => (
  <MenuStack.Navigator
    headerMode="none"
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <MenuStack.Screen name="MyOrders" component={MyOrders} />
    <MenuStack.Screen name="OrderProcessing" component={OrderProcessing} />
  </MenuStack.Navigator>
);
