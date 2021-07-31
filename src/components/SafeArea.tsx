import React from "react";
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from "react-native-safe-area-context";

import { useTheme } from "./theme";

const SafeArea = ({ children, ...props }: NativeSafeAreaViewProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      edges={["top", "right", "left"]}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeArea;
