import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./src/components/AppNavigator";
import { assets as CashbackAssets } from "./src/Cashback";
import { LoadAssets, ThemeProvider } from "./src/components";

const assets = [...CashbackAssets];

const fonts = {
  Bold: require("./assets/fonts/Roboto-Bold.ttf"),
  Medium: require("./assets/fonts/Roboto-Medium.ttf"),
  Normal: require("./assets/fonts/Roboto-Regular.ttf"),
  SMedium: require("./assets/fonts/Flamante-Roma-Medium.ttf"),
};

const App = () => {
  return (
    <ThemeProvider>
      <LoadAssets {...{ assets, fonts }}>
        <SafeAreaProvider>
          <StatusBar />
          <AppNavigator />
        </SafeAreaProvider>
      </LoadAssets>
    </ThemeProvider>
  );
};

export default App;
