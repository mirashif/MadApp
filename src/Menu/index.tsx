import React from "react";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import MyOrders from "./MyOrders/MyOrders";
import { OrderProcessing } from "./MyOrders/OrderProcessing";
import MyProfile from "./MyProfile/MyProfile";
import OrderDetails from "./MyOrders/OrderDetails/OrderDetails";
import Settings from "./Settings/Settings";
import { StoreLocator } from "./StoreLocator";

export { default as Menu } from "./Menu";

export type MenuStackProps<RouteName extends keyof MenuStackParamList> = {
  navigation: StackNavigationProp<MenuStackParamList, RouteName>;
  route: RouteProp<MenuStackParamList, RouteName>;
};

export type MenuStackParamList = {
  MyOrders: undefined;
  OrderDetails: { orderId: string };
  OrderProcessing: { orderId: string };
  MyProfile: undefined;
  Settings: undefined;
  StoreLocator: undefined;
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
    <MenuStack.Screen name="OrderDetails" component={OrderDetails} />
    <MenuStack.Screen name="OrderProcessing" component={OrderProcessing} />
    <MenuStack.Screen name="MyProfile" component={MyProfile} />
    <MenuStack.Screen name="Settings" component={Settings} />
    <MenuStack.Screen name="StoreLocator" component={StoreLocator} />
  </MenuStack.Navigator>
);
