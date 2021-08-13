import React from "react";
import { RouteProp } from "@react-navigation/native";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";

import { Menu } from "./Restaurant";

export { default as Home } from "./Home";

export type HomeStackProps<RouteName extends keyof HomeStackParamList> = {
  navigation: StackNavigationProp<HomeStackParamList, RouteName>;
  route: RouteProp<HomeStackParamList, RouteName>;
};

export type HomeStackParamList = {
  Menu: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => (
  <HomeStack.Navigator headerMode="none">
    <HomeStack.Screen name="Menu" component={Menu} />
  </HomeStack.Navigator>
);
