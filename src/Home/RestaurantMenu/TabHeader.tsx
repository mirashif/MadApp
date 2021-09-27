import React from "react";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";
import Animated, { useDerivedValue } from "react-native-reanimated";

import { Text } from "../../components";

import { defaultTabs, HEADER_HEIGHT } from "./constants";

interface TabHeaderProps {
  onMeasurement: (index: number, length: number) => void;
  onTabPress: (index: number) => void;
  y: Animated.SharedValue<number>;
}

const TabHeader = ({ onMeasurement, onTabPress, y }: TabHeaderProps) => {
  const tabs = defaultTabs;

  const activeIndex = useDerivedValue(() => {
    return true;
  });

  return (
    <View
      style={{
        height: HEADER_HEIGHT,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 8,
        }}
      >
        {tabs.map(({ name }, index) => (
          <TouchableWithoutFeedback
            onPress={() => onTabPress(index)}
            key={index}
          >
            <Animated.View
              onLayout={({
                nativeEvent: {
                  layout: { x: length },
                },
              }) => onMeasurement(index, length)}
              style={{
                height: HEADER_HEIGHT,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  fontSize: 18,
                  paddingHorizontal: 8,
                  color: activeIndex ? "#FFB81B" : "black",
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: "Bold",
                  fontSize: 18,
                  paddingHorizontal: 8,
                  color: activeIndex ? "#FFB81B" : "black",
                }}
              >
                {name}
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

export default TabHeader;
