import React from "react";
import { Feather } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Home } from "../Home";
import { Cashback } from "../Cashback";
import { Get100 } from "../Get100";
import { Settings } from "../Settings";

import { useTheme } from "./theme";

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) => <Feather size={26} {...props} />;

type BottomTabParamList = {
  Home: undefined;
  Cashback: undefined;
  Get100: undefined;
  Settings: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs = () => {
  const theme = useTheme();

  const tabBarOptions = {
    showLabel: true,
    activeTintColor: theme.colors.primary,
    inactiveTintColor: theme.colors.darkGray,
    labelStyle: {
      fontSize: 11,
      fontFamily: "Normal",
      marginTop: 5,
    },
    tabStyle: {
      width: 70,
    },
    style: {
      backgroundColor: theme.colors.background,
      paddingTop: 15,
      paddingBottom: 10,
      height: 70,
    },
  };

  return (
    <BottomTab.Navigator initialRouteName="Home" tabBarOptions={tabBarOptions}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "HOME",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Cashback"
        component={Cashback}
        options={{
          tabBarLabel: "CASHBACK",
          tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Get100"
        component={Get100}
        options={{
          tabBarLabel: "GET ৳100",
          tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "MENU",
          tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
};

export type RootStackProps<RouteName extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, RouteName>;
  route: RouteProp<RootStackParamList, RouteName>;
};

type RootStackParamList = {
  Home: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <RootStack.Navigator headerMode="none" initialRouteName="Home">
    <RootStack.Screen name="Home" component={BottomTabs} />
  </RootStack.Navigator>
);

export default AppNavigator;
