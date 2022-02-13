import React, { useEffect, useState } from "react";
import type { ScrollView } from "react-native";
import { View } from "react-native";
import { useAnimatedRef, useSharedValue } from "react-native-reanimated";

import type { HomeStackProps } from "..";
import { SafeArea, Text } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { RestaurantStore } from "../../state/store/RestaurantStore";

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
  const tabRef = useAnimatedRef<ScrollView>();
  const contentScroll = useSharedValue(0);
  // react state values
  const [activeId, setActiveId] = useState<string | undefined>(
    categories?.[0]?.id
  );
  const [tabs, setTabs] = useState<
    {
      categoryId: string;
      x: number;
    }[]
  >([]);

  const handleMeasurement = (categoryId: string, x: number) => {
    const newTab = { categoryId, x };
    setTabs((oldTabs) =>
      oldTabs.indexOf(newTab) === -1 ? [...oldTabs, newTab] : oldTabs
    );
  };

  const handleTabPress = (categoryId: string) => {
    setActiveId(categoryId);
  };

  useEffect(() => {
    const found = tabs.find((tab) => tab.categoryId === activeId);
    if (found)
      tabRef.current?.scrollTo({
        x: found.x,
        y: 0,
        animated: true,
      });
  }, [activeId, tabRef, tabs]);

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
      <Text>{JSON.stringify(tabs, null, 2)}</Text>
    </SafeArea>
  );
};

export default RestaurantMenu;
