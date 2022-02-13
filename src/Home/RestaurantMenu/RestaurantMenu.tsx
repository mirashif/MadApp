import React, { useEffect, useState } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { View } from "react-native";
import { useAnimatedRef, useSharedValue } from "react-native-reanimated";

import type { HomeStackProps } from "..";
import { SafeArea } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { RestaurantStore } from "../../state/store/RestaurantStore";
import ItemBottomSheet from "../ItemBottomSheet/ItemBottomSheet";

import type { IMeasurement } from "./constants";
import Content from "./Content";
import HeaderImage from "./HeaderImage";
import Offer from "./Offer";
import TabHeader from "./TabHeader";

const RestaurantMenu = ({ route }: HomeStackProps<"RestaurantMenu">) => {
  const { restaurantId } = route.params;
  const restaurants: RestaurantStore = useAppState("restaurants");
  const restaurant = restaurants.get(restaurantId);
  const restaurantName = restaurant?.data.name;
  const imageURI = restaurant?.data.bannerImageURI;
  const title = restaurant?.bannerTitle;
  const description = restaurant?.bannerDescription;
  const phone = restaurant?.data.phone;
  const categories = restaurant?.categories;

  // animated values
  const contentScroll = useSharedValue(0);
  const tabRef = useAnimatedRef<ScrollView>();
  const contentRef = useAnimatedRef<ScrollView>();

  // react state values
  const [bottomSheetItemId, setBottomSheetItemId] = useState<string | null>(
    null
  );
  const [activeId, setActiveId] = useState<string | undefined>(
    categories?.[0]?.id
  );
  const [tabMeasurements, setTabMeasurements] = useState<
    {
      categoryId: string;
      x: number;
    }[]
  >([]);
  const [contentMeasurements, setContentMeasurements] = useState<
    {
      categoryId: string;
      y: number;
    }[]
  >([]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    contentScroll.value = contentOffset.x;
  };

  const handleMeasurement = ({ categoryId, x, y }: IMeasurement) => {
    if (x !== undefined) {
      setTabMeasurements((prev) =>
        prev.indexOf({ categoryId, x }) === -1
          ? [...prev, { categoryId, x }]
          : prev
      );
    }
    if (y !== undefined) {
      setContentMeasurements((prev) =>
        prev.indexOf({ categoryId, y }) === -1
          ? [...prev, { categoryId, y }]
          : prev
      );
    }
  };

  const handleTabPress = (categoryId: string) => {
    setActiveId(categoryId);
    const found = contentMeasurements.find((c) => c.categoryId === categoryId);
    if (found)
      contentRef.current?.scrollTo({
        x: 0,
        y: found.y,
        animated: true,
      });
    console.log(found);
    console.log(categoryId);
    console.log(contentMeasurements);
  };

  const handleItemPress = (itemId: string) => {
    setBottomSheetItemId(itemId);
  };

  useEffect(() => {
    const found = tabMeasurements.find((t) => t.categoryId === activeId);
    if (found)
      tabRef.current?.scrollTo({
        x: found.x,
        y: 0,
        animated: true,
      });
  }, [activeId, tabRef, tabMeasurements]);

  if (!restaurant) return null;
  return (
    <SafeArea>
      <View>
        <HeaderImage {...{ contentScroll, restaurantName, imageURI }} />
        <Offer {...{ contentScroll, title, description, phone }} />
      </View>
      <TabHeader
        onMeasurement={handleMeasurement}
        onTabPress={handleTabPress}
        {...{ activeId, categories, tabRef }}
      />
      <Content
        onMeasurement={handleMeasurement}
        onItemPress={handleItemPress}
        onScroll={handleScroll}
        {...{
          categories,
          contentRef,
        }}
      />
      <ItemBottomSheet
        {...{
          bottomSheetItemId,
          setBottomSheetItemId,
        }}
      />
    </SafeArea>
  );
};

export default RestaurantMenu;
