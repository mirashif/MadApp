import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LogBox, Text } from "react-native";
import "react-native-get-random-values";
import { observer } from "mobx-react";

import AppNavigator from "./src/components/AppNavigator";
import { assets as CashbackAssets } from "./src/Cashback";
import { LoadAssets, ThemeProvider } from "./src/components";
import { augmentedFirebase } from "./src/state/augmentedFirebase";
import { StateProvider, useAppState } from "./src/state/StateContext";
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

const AppLoader = observer(() => {
  const store = useAppState();

  return store.ready ? (
    <BottomSheetModalProvider>
      <StatusBar />
      <AppNavigator />
    </BottomSheetModalProvider>
  ) : (
    <>
      <Text>LOADING</Text>
    </>
  );
});

const App = () => {
  const [ready, setReady] = useState(false);
  const store = useRef(null);

  const init = async () => {
    try {
      const firebase = await augmentedFirebase();
      const storeInstance = new Store(firebase);
      store.current = storeInstance;
      initializeReactions(storeInstance);
      setReady(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    init();
  }, [setReady]);

  return ready ? (
    <ThemeProvider>
      <LoadAssets {...{ assets, fonts }}>
        <StateProvider store={store.current}>
          <SafeAreaProvider>
            <AppLoader />
          </SafeAreaProvider>
        </StateProvider>
      </LoadAssets>
    </ThemeProvider>
  ) : null;
};

export default App;
