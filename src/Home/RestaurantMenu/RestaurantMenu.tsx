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

  // x, y scroll measurements
  const [X, setX] = useState<{ categoryId: string; x: number }[]>([]);
  const [Y, setY] = useState<{ categoryId: string; y: number }[]>([]);
  const [itemY, setItemY] = useState<{ itemId: string; y: number }[]>([]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    contentScroll.value = contentOffset.y;
  };

  const handleMeasurement = ({ categoryId, x, y, itemId }: IMeasurement) => {
    if (categoryId) {
      if (x !== undefined) {
        setX((prev) =>
          prev.indexOf({ categoryId, x }) === -1
            ? [...prev, { categoryId, x }]
            : prev
        );
      }
      if (y !== undefined) {
        setY((prev) =>
          prev.indexOf({ categoryId, y }) === -1
            ? [...prev, { categoryId, y }]
            : prev
        );
      }
    }
    if (itemId && y !== undefined) {
      setItemY((prev) =>
        prev.indexOf({ itemId, y }) === -1 ? [...prev, { itemId, y }] : prev
      );
    }
  };

  const handleTabPress = (categoryId: string) => {
    setActiveId(categoryId);
    const found = Y.find((m) => m.categoryId === categoryId);
    if (found)
      contentRef.current?.scrollTo({
        x: 0,
        y: found.y,
        animated: true,
      });
  };

  const handleItemPress = (itemId: string) => {
    setBottomSheetItemId(itemId);
  };

  // handling tabheader scroll
  useEffect(() => {
    const found = X.find((m) => m.categoryId === activeId);
    if (found)
      tabRef.current?.scrollTo({
        x: found.x,
        y: 0,
        animated: true,
      });
  }, [activeId, tabRef, X]);

  // TODO: add story scroll
  useEffect(() => {
    const found = itemY.find(
      (m) => m.itemId === "fc6bb81a-fb09-4e6c-9454-d725f55cb1d8"
    );
    if (found)
      contentRef.current?.scrollTo({
        x: 0,
        y: found.y,
        animated: true,
      });
  }, [contentRef, itemY]);

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
