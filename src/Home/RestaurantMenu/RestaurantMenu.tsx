import React from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Button, ScrollView, View } from "react-native";
import {
  useAnimatedRef,
  useSharedValue,
  useDerivedValue,
  scrollTo,
} from "react-native-reanimated";

import type { HomeStackProps } from "..";
import { SafeArea, Text } from "../../components";

const RestaurantMenu = ({ route }: HomeStackProps<"RestaurantMenu">) => {
  const aref = useAnimatedRef<ScrollView>();
  const scroll = useSharedValue(0);

  useDerivedValue(() => {
    scrollTo(aref, 0, scroll.value, true);
  });

  const items = Array.from(Array(10).keys());

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scroll.value = event.nativeEvent.contentOffset.y;
  };

  return (
    <SafeArea>
      <Button
        title={"" + scroll.value}
        onPress={() => {
          scroll.value = scroll.value + 120;
        }}
      />
      <View style={{ backgroundColor: "green" }}>
        <Child onScroll={handleOnScroll} {...{ items, aref }} />
      </View>
    </SafeArea>
  );
};

export default RestaurantMenu;

const Child = ({
  items,
  aref,
  onScroll,
}: {
  items: number[];
  aref: React.RefObject<ScrollView>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) => {
  return (
    <ScrollView
      ref={aref}
      onScroll={onScroll}
      scrollToOverflowEnabled={true}
      style={{ backgroundColor: "orange" }}
    >
      {items.map((_, i) => (
        <View
          key={i}
          style={{
            backgroundColor: "white",
            height: 100,
            margin: 10,
          }}
        >
          <Text>INDEX {i}</Text>
        </View>
      ))}
    </ScrollView>
  );
};
