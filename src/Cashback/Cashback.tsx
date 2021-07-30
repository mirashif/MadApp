import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "../components";

// interface CashbackProps {}

const Cashback = () =>
  // props: CashbackProps
  {
    return (
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text>Cashback</Text>
        </ScrollView>
      </SafeAreaView>
    );
  };

export default Cashback;
