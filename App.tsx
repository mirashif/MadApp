import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LogBox } from "react-native";

import AppNavigator from "./src/components/AppNavigator";
import { assets as CashbackAssets } from "./src/Cashback";
import { LoadAssets, ThemeProvider } from "./src/components";

LogBox.ignoreLogs([
  "ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.",
]);

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
          <BottomSheetModalProvider>
            <StatusBar />
            <AppNavigator />
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </LoadAssets>
    </ThemeProvider>
  );
};

export default App;
