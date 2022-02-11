import { observer } from "mobx-react";
import React, { useState } from "react";
import { View } from "react-native";
import {
  runOnJS,
  scrollTo,
  useAnimatedRef,
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

/* 
TODO: implement new scroll library
https://github.com/slorber/react-native-scroll-into-view#readme
 */
const RestaurantMenu = observer(
  ({ route }: HomeStackProps<"RestaurantMenu">) => {
    const { restaurantId } = route.params;
    const restaurants: RestaurantStore = useAppState("restaurants");
    const restaurant = restaurants.get(restaurantId);

    const [anchorX, setAnchorX] = useState<number[] | null>(null);
    const [anchorY, setAnchorY] = useState<number[] | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const manualScrolling = useSharedValue(false);
    const scrollViewRefX = useAnimatedRef();
    const scrollViewRefY = useAnimatedRef();
    const y = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler(
      {
        onScroll: (event) => {
          if (manualScrolling.value) return;
          y.value = event.contentOffset.y;
          runOnJS(handleSelectedIndex)(y.value);
        },
      },
      [manualScrolling]
    );

    useDerivedValue(() => {
      manualScrolling.value = true;
      scrollTo(scrollViewRefY, 0, y.value, true);
      manualScrolling.value = false;
    });

    const handleIndexScroll = (index: number) => {
      "worklet";
      if (!anchorY) return;
      y.value = anchorY[index];
      runOnJS(handleSelectedIndex)(y.value);
    };

    // const y = useSharedValue(0);
    // const activeIndex = useSharedValue(0);
    // const [anchorX, setAnchorX] = useState<number[] | null>(null);
    // const [anchorY, setAnchorY] = useState<number[] | null>(null);
    // const scrollViewRefX = useAnimatedRef();
    // const scrollViewRefY = useAnimatedRef();

    // const scrollHandler = useAnimatedScrollHandler((event) => {
    //   y.value = event.contentOffset.y;
    // });

    const handleSelectedIndex = (_y: number) => {
      if (!anchorY) return;
      anchorY.forEach((_, i) => {
        if (_y < Math.floor(anchorY[1])) setSelectedIndex(0);
        else if (_y > Math.floor(anchorY[i]) && _y < Math.floor(anchorY[i + 1]))
          setSelectedIndex(i);
        else if (_y >= Math.floor(anchorY[anchorY.length - 1]))
          setSelectedIndex(anchorY.length - 1);
      });
    };

    // useDerivedValue(() => {
    //   if (!anchorX || !anchorY) return;
    //   scrollTo(scrollViewRefY, 0, anchorY[activeIndex.value], true);
    //   // scrollTo(scrollViewRefX, anchorX[activeIndex.value], 0, true);
    //   runOnJS(handleActiveIndex)(y.value);
    // }, [activeIndex, anchorX, anchorY]);

    if (!restaurant) return null;
    return (
      <SafeArea>
        <View>
          <HeaderImage
            y={y}
            restaurantName={restaurant.data.name}
            imageURI={restaurant.data.bannerImageURI}
          />
          <Offer
            y={y}
            title={restaurant.bannerTitle}
            description={restaurant.bannerDescription}
            phone={restaurant.data.phone}
          />
        </View>

        {restaurant.categories && (
          <TabHeader
            scrollViewRefX={scrollViewRefX}
            activeIndex={selectedIndex}
            onTabPress={(index: number) => handleIndexScroll(index)}
            onMeasurement={(index, length) => {
              const _anchorX = anchorX || [];
              _anchorX[index] = length;
              setAnchorX(_anchorX);
            }}
            categories={restaurant.categories}
          />
        )}

        {restaurant.categories && (
          <Content
            scrollViewRef={scrollViewRefY}
            onMeasurement={(index, length) => {
              const _anchorY = anchorY || [];
              _anchorY[index] = length;
              setAnchorY(_anchorY);
            }}
            onScroll={scrollHandler}
            categories={restaurant.categories}
          />
        )}
      </SafeArea>
    );
  }
);

export default RestaurantMenu;
