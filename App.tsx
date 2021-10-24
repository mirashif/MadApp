import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LogBox } from "react-native";
import "react-native-get-random-values";

import AppNavigator from "./src/components/AppNavigator";
import { assets as CashbackAssets } from "./src/Cashback";
import { LoadAssets, ThemeProvider } from "./src/components";
import { augmentedFirebase } from "./src/state/augmentedFirebase";
import { StateProvider } from "./src/state/StateContext";
import { Store } from "./src/state/store";
import { initializeReactions } from "./src/state/reactions";

LogBox.ignoreLogs([
  "ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component is no longer necessary. You can now directly use the ref instead. This method will be removed in a future release.",
]);

const assets = [...CashbackAssets];

const fonts = {
  Bold: require("./assets/fonts/Roboto-Bold.ttf"),
  Medium: require("./assets/fonts/Roboto-Medium.ttf"),
  Normal: require("./assets/fonts/Roboto-Regular.ttf"),
};

const App = () => {
  const [ready, setReady] = useState(false);
  const store = useRef(null);

  useEffect(() => {
    (async () => {
      const firebase = await augmentedFirebase();
      const storeInstance = new Store(firebase);

      store.current = storeInstance;
      initializeReactions(storeInstance);

      setReady(true);
    })();
  }, [setReady]);

  return ready ? (
    <ThemeProvider>
      <LoadAssets {...{ assets, fonts }}>
        <StateProvider store={store.current}>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <StatusBar />
              <AppNavigator />
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </StateProvider>
      </LoadAssets>
    </ThemeProvider>
  ) : null;
};

export default App;
