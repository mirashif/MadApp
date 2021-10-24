import React, { useRef, useState } from "react";
import { View } from "react-native";
import type Animated from "react-native-reanimated";
import {
  runOnJS,
  useAnimatedScrollHandler,
  useDerivedValue,
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

  const y = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    y.value = event.contentOffset.y;
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const handleActiveIndex = (v: number) => {
    anchorY.forEach((_, i) => {
      if (v < Math.floor(anchorY[1])) setActiveIndex(0);
      else if (v > Math.floor(anchorY[i]) && v < Math.floor(anchorY[i + 1]))
        setActiveIndex(i);
      else if (v >= Math.floor(anchorY[anchorY.length - 1]))
        setActiveIndex(anchorY.length - 1);
    });
  };

  useDerivedValue(() => {
    runOnJS(handleActiveIndex)(y.value);
  });

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
