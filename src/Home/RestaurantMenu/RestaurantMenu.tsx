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

  // const anchorX: number[] = [];
  // const handleAnchorX = (index: number, length: number) => {
  //   anchorX[index] = length;
  // };

  // const anchorY: number[] = [];
  // const handleAnchorY = (index: number, length: number) => {
  //   anchorY[index] = length;
  // };

  return (
    <SafeArea>
      <View>
        <HeaderImage y={y} />
        <Offer y={y} />
      </View>
      <TabHeader onMeasurement={() => console.log("X")} />
      <Content onMeasurement={() => console.log("Y")} onScroll={onScroll} />
    </SafeArea>
  );
};

export default RestaurantMenu;
