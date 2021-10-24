import React from "react";
import { Dimensions, View } from "react-native";
import Animated from "react-native-reanimated";

import { Text, useTheme } from "../../components";

import { menu } from "./constants";
import Item from "./Item";

interface ContentProps {
  onScroll: () => void;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  onMeasurement: (index: number, length: number) => void;
}

const Content = ({ onScroll, onMeasurement, scrollViewRef }: ContentProps) => {
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
      {menu.map(({ name, items }, index) => (
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
            {name}
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
              <Item key={j} {...item} />
            ))}
          </View>
        </View>
      ))}
    </Animated.ScrollView>
  );
};

export default Content;
