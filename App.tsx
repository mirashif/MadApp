import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LoadAssets, ThemeProvider } from "./src/components";
import AppNavigator from "./src/components/AppNavigator";

const fonts = {
  Bold: require("./assets/fonts/Roboto-Bold.ttf"),
  Medium: require("./assets/fonts/Roboto-Medium.ttf"),
  Normal: require("./assets/fonts/Roboto-Regular.ttf"),
  SMedium: require("./assets/fonts/Flamante-Roma-Medium.ttf"),
};

const App = () => {
  return (
    <ThemeProvider>
      <LoadAssets {...{ fonts }}>
        <SafeAreaProvider>
          <StatusBar />
          <AppNavigator />
        </SafeAreaProvider>
      </LoadAssets>
    </ThemeProvider>
  );
};

export default App;
