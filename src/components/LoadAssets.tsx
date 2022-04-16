import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";

export type FontSource = Parameters<typeof Font.loadAsync>[0];
const usePromiseAll = (
  promises: Promise<void | void[] | Asset[]>[],
  cb: () => void
) =>
  useEffect(() => {
    (async () => {
      await Promise.all(promises);
      cb();
    })();
  });

const useLoadAssets = (assets: number[], fonts: FontSource): boolean => {
  const [ready, setReady] = useState(false);
  usePromiseAll(
    [Font.loadAsync(fonts), ...assets.map((asset) => Asset.loadAsync(asset))],
    () => setReady(true)
  );
  return ready;
};

interface LoadAssetsProps {
  fonts?: FontSource;
  assets?: number[];
  children: ReactElement | ReactElement[];
}

const LoadAssets = ({ assets, fonts, children }: LoadAssetsProps) => {
  const ready = useLoadAssets(assets || [], fonts || {});

  if (!ready) {
    return <AppLoading />;
  }
  return (
    <NavigationContainer>
      <StatusBar />
      {children}
    </NavigationContainer>
  );
};

export default LoadAssets;
