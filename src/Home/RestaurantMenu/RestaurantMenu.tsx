import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import type Animated from "react-native-reanimated";
import {
  runOnJS,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import type { HomeStackProps } from "..";
import { SafeArea } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { RestaurantStore } from "../../state/store/RestaurantStore";

import Content from "./Content";
import HeaderImage from "./HeaderImage";
import Offer from "./Offer";
import TabHeader from "./TabHeader";

const RestaurantMenu = ({ route }: HomeStackProps<"RestaurantMenu">) => {
  const [anchorX, setAnchorX] = useState<number[]>([]);
  const [anchorY, setAnchorY] = useState<number[]>([]);
  const scrollViewRefX = useRef<Animated.ScrollView>(null);
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

  // Handles Tab scroll
  useEffect(() => {
    scrollViewRefX.current?.getNode().scrollTo({
      x: anchorX[activeIndex],
      animated: true,
    });
  }, [activeIndex, anchorX]);

  const { restaurantId } = route.params;

  const restaurants: RestaurantStore = useAppState("restaurants");

  const restaurant = useMemo(
    () => restaurants.get(restaurantId),
    [restaurantId, restaurants]
  );

  if (!restaurant) return null;
  return (
    <SafeArea>
      <View>
        <HeaderImage
          y={y}
          restaurantName={restaurant.data.name}
          bannerImageURI={restaurant.data.bannerImageURI}
        />
        <Offer
          y={y}
          bannerTitle={restaurant.bannerTitle}
          bannerDescription={restaurant.bannerDescription}
          contactNumber={restaurant.data.phone}
        />
      </View>
      <TabHeader
        scrollViewRefX={scrollViewRefX}
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
        categories={restaurant.categories}
      />
      <Content
        scrollViewRef={scrollViewRef}
        onMeasurement={(index, length) => {
          const _anchorY = anchorY;
          _anchorY[index] = length;
          setAnchorY(_anchorY);
        }}
        onScroll={scrollHandler}
        categories={restaurant.categories}
      />
    </SafeArea>
  );
};

export default RestaurantMenu;
