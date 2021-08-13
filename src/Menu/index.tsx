import React from "react";
import { RouteProp } from "@react-navigation/native";
import {
  StackNavigationProp,
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import MyOrders from "./MyOrders/MyOrders";
import OrderProcessing from "./OrderProcessing/OrderProcessing";
import MyProfile from "./MyProfile/MyProfile";
import OrderDetails from "./MyOrders/OrderDetails/OrderDetails";
import Settings from "./Settings/Settings";

export { default as Menu } from "./Menu";

export type MenuStackProps<RouteName extends keyof MenuStackParamList> = {
  navigation: StackNavigationProp<MenuStackParamList, RouteName>;
  route: RouteProp<MenuStackParamList, RouteName>;
};

export type MenuStackParamList = {
  MyOrders: undefined;
  OrderDetails: undefined;
  OrderProcessing: undefined;
  MyProfile: undefined;
  Settings: undefined;
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
  </MenuStack.Navigator>
);
