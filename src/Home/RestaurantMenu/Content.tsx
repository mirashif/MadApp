import React from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Dimensions, View } from "react-native";
import Animated from "react-native-reanimated";

import { Text, useTheme } from "../../components";
import type { Category } from "../../state/store/CategoryStore";

import Item from "./Item";

interface ContentProps {
  onScroll:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | Animated.Node<
        ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined
      >
    | undefined;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  onMeasurement: (index: number, length: number) => void;
  categories: Category[];
}

const Content = ({
  onScroll,
  onMeasurement,
  scrollViewRef,
  categories,
}: ContentProps) => {
  const theme = useTheme();
  const { height: sHeight } = Dimensions.get("screen");

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={onScroll}
      contentContainerStyle={{
        paddingBottom: sHeight,
      }}
    >
      {categories.map(({ data, items }, index) => (
        // menu container
        <View
          key={index}
          onLayout={({
            nativeEvent: {
              layout: { y: length },
            },
          }) => onMeasurement(index, length)}
          style={{
            paddingHorizontal: theme.spacing.screen,
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Normal",
              color: theme.colors.foreground,
              marginBottom: 4,
              marginHorizontal: 8,
            }}
          >
            {data.name}
          </Text>

          {/* items container */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {items.map((item, j) => (
              <Item key={j} item={item} />
            ))}
          </View>
        </View>
      ))}
    </Animated.ScrollView>
  );
};

export default Content;
