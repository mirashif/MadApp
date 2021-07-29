import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LoadAssets, ThemeProvider } from "./src/components";
import Home from "./src/Home/Home";

const fonts = {
  Bold: require("./assets/fonts/Roboto-Bold.ttf"),
  Medium: require("./assets/fonts/Roboto-Medium.ttf"),
  Normal: require("./assets/fonts/Roboto-Regular.ttf"),
  // Secondary fonts
  SMedium: require("./assets/fonts/Flamante-Roma-Medium.ttf"),
};

export default function App() {
  return (
    <ThemeProvider>
      <LoadAssets {...{ fonts }}>
        <SafeAreaProvider>
          <StatusBar />
          <Home />
        </SafeAreaProvider>
      </LoadAssets>
    </ThemeProvider>
  );
}
