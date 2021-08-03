import React from "react";
import { Feather } from "@expo/vector-icons";
import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
  StackNavigationProp,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { Home } from "../Home";
import { Cashback } from "../Cashback";
import { Get100 } from "../Get100";
import { Menu, MenuNavigator, MenuStackPramList } from "../Menu";

import { useTheme } from "./theme";

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) => <Feather size={26} {...props} />;

const Get100SVG = ({ color }: { color: string }) => (
  <Svg width={26} height={24} viewBox="0 0 26 24" fill="none">
    <Path
      d="M1.78 13.791c-.426 0-.658-.177-.778-.325-.118-.145-.24-.403-.155-.803L2.728 3.9l-1.182.067h-.009c-.356 0-.615-.116-.777-.316a.789.789 0 01-.152-.676c.103-.484.609-.887 1.15-.917l2.763-.156c.054-.004.103-.006.15-.006.101 0 .37 0 .54.211.173.216.115.49.095.579L3.152 12.725c-.129.61-.633 1.027-1.286 1.063l-.087.003zm7.407-1.38c-.992 0-1.817-.37-2.385-1.074-.802-.992-1.011-2.518-.605-4.411.711-3.318 2.901-5.645 5.449-5.79 1.096-.06 2.003.313 2.615 1.069.802.992 1.012 2.518.606 4.411-.712 3.317-2.902 5.643-5.45 5.788a3.223 3.223 0 01-.23.008zm2.354-9.478l-.094.003c-1.338.076-2.451 1.589-2.979 4.045-.33 1.536-.263 2.688.188 3.246.204.253.494.382.86.382l.097-.002c1.338-.076 2.451-1.587 2.978-4.044.33-1.536.263-2.69-.186-3.246-.204-.255-.495-.384-.864-.384zm7.993 8.349c-.992 0-1.818-.372-2.387-1.076-.802-.992-1.012-2.518-.605-4.411.712-3.319 2.902-5.645 5.45-5.788 1.104-.062 2 .312 2.613 1.068.802.992 1.011 2.517.605 4.41-.711 3.316-2.9 5.643-5.449 5.79a3.172 3.172 0 01-.227.007zm2.352-9.48l-.093.003c-1.339.077-2.453 1.589-2.98 4.044-.329 1.537-.262 2.69.188 3.247.205.254.496.382.863.382l.096-.002c1.337-.075 2.451-1.588 2.978-4.044.33-1.536.264-2.688-.186-3.246-.206-.255-.497-.384-.866-.384zM8.173 23.445a1.38 1.38 0 01-.485-2.67c.233-.088 5.792-2.144 14.161-2.842a1.38 1.38 0 01.229 2.749c-7.992.666-13.368 2.655-13.422 2.675-.158.06-.322.088-.483.088zm-6.205-4.137a1.38 1.38 0 01-.496-2.666c.374-.145 9.32-3.535 22.488-4.228a1.37 1.37 0 011.45 1.305c.04.76-.544 1.41-1.305 1.45-12.704.669-21.556 4.014-21.644 4.047a1.392 1.392 0 01-.493.091z"
      fill={color}
    />
  </Svg>
);

type BottomTabParamList = {
  Home: undefined;
  Cashback: undefined;
  Get100: undefined;
  Settings: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const tabBarOptions = {
    showLabel: true,
    activeTintColor: theme.colors.primary,
    inactiveTintColor: theme.colors.darkGray,
    labelStyle: {
      fontSize: 11,
      fontFamily: "Normal",
      marginTop: 5,
    },
    style: {
      backgroundColor: theme.colors.background,
      height: 70 + insets.bottom,
      paddingTop: 15,
      paddingBottom: 10 + insets.bottom,
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
          tabBarIcon: ({ color }) => <Get100SVG color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Menu}
        options={{
          tabBarLabel: "MENU",
          tabBarIcon: ({ color }) => <TabBarIcon name="menu" color={color} />,
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
  MenuStack: NavigatorScreenParams<MenuStackPramList>;
};

const RootStack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <RootStack.Navigator
    headerMode="none"
    initialRouteName="Home"
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <RootStack.Screen name="Home" component={BottomTabs} />
    <RootStack.Screen name="MenuStack" component={MenuNavigator} />
  </RootStack.Navigator>
);

export default AppNavigator;
