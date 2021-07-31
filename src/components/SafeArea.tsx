import React from "react";
import { ScrollView } from "react-native";
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from "react-native-safe-area-context";

import { useTheme } from "./theme";

const SafeScrollView = ({ children, ...props }: NativeSafeAreaViewProps) => {
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
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </SafeAreaView>
  );
};

export default SafeScrollView;
