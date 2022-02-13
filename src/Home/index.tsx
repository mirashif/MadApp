import React from "react";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";

import { RestaurantMenu } from "./RestaurantMenu";
import { Cart } from "./Cart";
import { Checkout } from "./Checkout";
import { Story } from "./Story";

export { default as Home } from "./Home";

export type HomeStackProps<RouteName extends keyof HomeStackParamList> = {
  navigation: StackNavigationProp<HomeStackParamList, RouteName>;
  route: RouteProp<HomeStackParamList, RouteName>;
};

export type HomeStackParamList = {
  RestaurantMenu: {
    restaurantId: string;
    target:
      | null
      | {
          type: "category";
          categoryID: string;
        }
      | {
          type: "item" | "item-builder";
          itemID: string;
        }
      | {
          type: "restaurant";
        };
  };
  Cart: undefined;
  Checkout: undefined;
  Story: {
    id: string;
  };
};

const HomeStack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => (
  <HomeStack.Navigator headerMode="none">
    <HomeStack.Screen name="RestaurantMenu" component={RestaurantMenu} />
    <HomeStack.Screen name="Cart" component={Cart} />
    <HomeStack.Screen name="Checkout" component={Checkout} />
    <HomeStack.Screen name="Story" component={Story} />
  </HomeStack.Navigator>
);
