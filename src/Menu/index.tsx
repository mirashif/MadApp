import React from "react";
import { RouteProp } from "@react-navigation/native";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";

import MyOrders from "./MyOrders";

export { default as Menu } from "./Menu";

export type MenuStackProps<RouteName extends keyof MenuStackPramList> = {
  navigation: StackNavigationProp<MenuStackPramList, RouteName>;
  route: RouteProp<MenuStackPramList, RouteName>;
};

export type MenuStackPramList = {
  MyOrders: undefined;
};

const MenuStack = createStackNavigator<MenuStackPramList>();

export const MenuNavigator = () => (
  <MenuStack.Navigator headerMode="none">
    <MenuStack.Screen name="MyOrders" component={MyOrders} />
  </MenuStack.Navigator>
);
