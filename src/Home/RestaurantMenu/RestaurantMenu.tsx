import { observer } from "mobx-react";
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
    const y = useSharedValue(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [anchorX, setAnchorX] = useState<number[]>([]);
    const [anchorY, setAnchorY] = useState<number[]>([]);
    const scrollViewRefX = useRef<Animated.ScrollView>(null);
    const scrollViewRef = useRef<Animated.ScrollView>(null);

    const scrollHandler = useAnimatedScrollHandler((event) => {
      y.value = event.contentOffset.y;
    });

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

    useEffect(() => {
      if (scrollViewRefX.current && scrollViewRefX.current.getNode) {
        const node = scrollViewRefX.current.getNode();
        if (node) {
          node.scrollTo({
            x: anchorX[activeIndex],
            animated: true,
          });
        }
      }
    }, [activeIndex, anchorX]);

    const { restaurantId } = route.params;
    const restaurants: RestaurantStore = useAppState("restaurants");
    const restaurant = restaurants.get(restaurantId);

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
            activeIndex={activeIndex}
            onTabPress={(index: number) => {
              if (scrollViewRef.current && scrollViewRef.current.getNode) {
                const node = scrollViewRef.current.getNode();
                if (node) {
                  node.scrollTo({
                    y: anchorY[index],
                    animated: true,
                  });
                }
              }
            }}
            onMeasurement={(index, length) => {
              const _anchorX = anchorX;
              _anchorX[index] = length;
              setAnchorX(_anchorX);
            }}
            categories={restaurant.categories}
          />
        )}

        {restaurant.categories && (
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
        )}
      </SafeArea>
    );
  }
);

export default RestaurantMenu;
