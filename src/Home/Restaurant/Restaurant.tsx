import { observer } from "mobx-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { View } from "react-native";
import {
  runOnJS,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import type { HomeStackProps } from "..";
import { SafeArea } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { RestaurantStore } from "../../state/store/RestaurantStore";
import { ItemBuilder } from "../ItemBuilder";

import type { IMeasurement } from "./constants";
import Content from "./Content";
import HeaderImage from "./HeaderImage";
import Offer from "./Offer";
import TabHeader from "./TabHeader";

const Restaurant = observer(({ route }: HomeStackProps<"Restaurant">) => {
  const { restaurantId, target } = route.params;

  const restaurants: RestaurantStore = useAppState("restaurants");
  const restaurant = useMemo(
    () => restaurants.get(restaurantId),
    [restaurantId, restaurants]
  );

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
  const [itemBuilderId, setItemBuilderId] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>();

  // x, y scroll measurements
  const [X, setX] = useState<{ categoryId: string; x: number }[]>([]);
  const [Y, setY] = useState<{ categoryId: string; y: number }[]>([]);
  const [itemY, setItemY] = useState<{ itemId: string; y: number }[]>([]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    contentScroll.value = contentOffset.y;
  };

  const handleMeasurement = useCallback(
    ({ categoryId, x, y, itemId }: IMeasurement) => {
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
              ? [...prev, { categoryId, y }].sort((a, b) => a.y - b.y)
              : prev
          );
        }
      }
      if (itemId && y !== undefined) {
        setItemY((prev) =>
          prev.indexOf({ itemId, y }) === -1 ? [...prev, { itemId, y }] : prev
        );
      }
    },
    []
  );

  const handleTabPress = useCallback(
    (categoryId: string) => {
      const found = Y.find((item) => item.categoryId === categoryId);
      if (found)
        contentRef.current?.scrollTo({
          x: 0,
          y: found.y,
          animated: true,
        });
    },
    [Y, contentRef]
  );

  const handleItemPress = (itemId: string) => {
    setItemBuilderId(itemId);
  };

  // handling tabheader scroll
  useEffect(() => {
    const found = X.find((item) => item.categoryId === activeTabId);
    if (found)
      tabRef.current?.scrollTo({
        x: found.x,
        y: 0,
        animated: true,
      });
  }, [activeTabId, tabRef, X]);

  /* 
    handling active tab id
    based on content scroll
  */
  const handleActiveTabId = useCallback(
    (scroll: number) => {
      Y.find((_, i) => {
        // first tab
        if (Y[1] && scroll < Y[1].y) {
          return setActiveTabId(Y[0].categoryId);
        }
        // middle tabs
        else if (Y[i + 1] && scroll >= Y[i].y && scroll < Y[i + 1].y) {
          return setActiveTabId(Y[i].categoryId);
        }
        // last tab
        else if (scroll >= Y[Y.length - 1].y) {
          return setActiveTabId(Y[Y.length - 1].categoryId);
        }
      });
    },
    [Y]
  );

  useDerivedValue(() => {
    runOnJS(handleActiveTabId)(contentScroll.value);
  });

  const scrollToItem = useCallback(
    (itemId: string) => {
      const found = itemY.find((item) => item.itemId === itemId);
      if (found)
        contentRef.current?.scrollTo({
          x: 0,
          y: found.y,
          animated: true,
        });
    },
    [contentRef, itemY]
  );

  // handling story swipe gestures
  useEffect(() => {
    if (!target) return;
    else if (target.type === "category") {
      handleTabPress(target.categoryID);
    } else if (target.type === "item") {
      scrollToItem(target.itemID);
    } else if (target.type === "item-builder") {
      scrollToItem(target.itemID);
      setItemBuilderId(target.itemID);
    } else {
      return;
    }
  }, [contentRef, handleTabPress, itemY, scrollToItem, target]);

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
        {...{
          activeTabId: activeTabId ?? restaurant.categories[0].id,
          categories,
          tabRef,
        }}
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
      <ItemBuilder
        {...{
          itemBuilderId,
          setItemBuilderId,
        }}
      />
    </SafeArea>
  );
});

export default Restaurant;
