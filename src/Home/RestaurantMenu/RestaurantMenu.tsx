import React, { useRef } from "react";
import { View } from "react-native";
import type Animated from "react-native-reanimated";
import { onScrollEvent, useValue } from "react-native-redash/lib/module/v1";

import { SafeArea } from "../../components";

import Content from "./Content";
import HeaderImage from "./HeaderImage";
import Offer from "./Offer";
import TabHeader from "./TabHeader";

const RestaurantMenu = () => {
  const scrollView = useRef<Animated.ScrollView>(null);
  const y = useValue(0);
  const onScroll = onScrollEvent({ y });

  return (
    <SafeArea>
      <View>
        <HeaderImage y={y} />
        <Offer y={y} />
      </View>
      <TabHeader />
      <Content onScroll={onScroll} />
    </SafeArea>
  );
};

export default RestaurantMenu;
