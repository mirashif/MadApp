import React from "react";
import { RouteProp } from "@react-navigation/native";
import {
  StackNavigationProp,
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import MobileNumber from "./MobileNumber";

export type AuthStackProps<RouteName extends keyof AuthStackParamList> = {
  navigation: StackNavigationProp<AuthStackParamList, RouteName>;
  route: RouteProp<AuthStackParamList, RouteName>;
};

export type AuthStackParamList = {
  MobileNumber: undefined;
  Verfication: undefined;
  ProfileInfo: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <AuthStack.Navigator
    headerMode="none"
    initialRouteName="MobileNumber"
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <AuthStack.Screen name="MobileNumber" component={MobileNumber} />
  </AuthStack.Navigator>
);
