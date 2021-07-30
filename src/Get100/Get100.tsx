import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "../components";

// interface CashbackProps {}

const Get100 = () =>
  // props: CashbackProps
  {
    return (
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text>Get 100 Taka</Text>
        </ScrollView>
      </SafeAreaView>
    );
  };

export default Get100;
