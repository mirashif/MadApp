import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import type Animated from "react-native-reanimated";
import {
  runOnJS,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import type { HomeStackProps } from "..";
import { SafeArea, Text } from "../../components";
import { useAppState } from "../../state/StateContext";
import type {
  Restaurant,
  RestaurantStore,
} from "../../state/store/RestaurantStore";

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

  const { restaurantId } = route.params;
  const restaurants: RestaurantStore = useAppState("restaurants");

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

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

  useEffect(() => {
    const _restaurant = restaurants.get(restaurantId);
    setRestaurant(_restaurant);
  }, [restaurantId, restaurants]);

  return (
    <SafeArea>
      <View>
        <HeaderImage y={y} restaurantName={restaurant?.data.name || ""} />
        <Offer y={y} />
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
        categories={restaurant?.categories || []}
      />
      {restaurant?.categories.map((c) => (
        <Text key={c.id}>{c.items}</Text>
      ))}
      <Content
        scrollViewRef={scrollViewRef}
        onMeasurement={(index, length) => {
          const _anchorY = anchorY;
          _anchorY[index] = length;
          setAnchorY(_anchorY);
        }}
        onScroll={scrollHandler}
        categories={restaurant?.categories || []}
      />
    </SafeArea>
  );
};

export default RestaurantMenu;
