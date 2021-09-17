import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { Text, useTheme } from "../../components";

import { menu } from "./constants";
import Item from "./Item";

interface ContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScroll: any;
  onMeasurement: (index: number, length: number) => void;
}

const Content = ({ onScroll, onMeasurement }: ContentProps) => {
  const theme = useTheme();

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={1}
      onScroll={onScroll}
    >
      {menu.map(({ name, items }, index) => (
        // menu container
        <View
          key={index}
          onLayout={({
            nativeEvent: {
              layout: { x: length },
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
