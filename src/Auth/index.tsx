import React from "react";
import { RouteProp } from "@react-navigation/native";
import {
  StackNavigationProp,
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import MobileNumber from "./MobileNumber";
import Verification from "./Verification";
import UserInfo from "./UserInfo";

export type AuthStackProps<RouteName extends keyof AuthStackParamList> = {
  navigation: StackNavigationProp<AuthStackParamList, RouteName>;
  route: RouteProp<AuthStackParamList, RouteName>;
};

export type AuthStackParamList = {
  MobileNumber: undefined;
  Verification: {
    phoneNumber: string;
  };
  UserInfo: undefined;
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
    <AuthStack.Screen name="Verification" component={Verification} />
    <AuthStack.Screen name="UserInfo" component={UserInfo} />
  </AuthStack.Navigator>
);
