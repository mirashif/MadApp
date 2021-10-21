import React, { useRef, useState } from "react";
import { View } from "react-native";
import type Animated from "react-native-reanimated";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { SafeArea } from "../../components";

import Content from "./Content";
import HeaderImage from "./HeaderImage";
import Offer from "./Offer";
import TabHeader from "./TabHeader";

const RestaurantMenu = () => {
  const [anchorX, setAnchorX] = useState<number[]>([]);
  const [anchorY, setAnchorY] = useState<number[]>([]);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const y = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    y.value = event.contentOffset.y;
  });
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <SafeArea>
      <View>
        <HeaderImage y={y} />
        <Offer y={y} />
      </View>
      <TabHeader
        activeIndex={activeIndex}
        onTabPress={(index: number) => {
          scrollViewRef.current?.getNode().scrollTo({
            y: anchorY[index],
            animated: true,
          });
        }}
        onMeasurement={(index, length) => {
          const _anchorX = anchorX;
          _anchorX[index] = length;
          setAnchorX(_anchorX);
        }}
      />
      <Content
        scrollViewRef={scrollViewRef}
        onMeasurement={(index, length) => {
          const _anchorY = anchorY;
          _anchorY[index] = length;
          setAnchorY(_anchorY);
        }}
        onScroll={scrollHandler}
      />
    </SafeArea>
  );
};

export default RestaurantMenu;
