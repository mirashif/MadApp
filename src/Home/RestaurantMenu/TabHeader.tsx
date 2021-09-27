import React from "react";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";
import Animated from "react-native-reanimated";

import { Text } from "../../components";

import { defaultTabs, HEADER_HEIGHT } from "./constants";

interface TabHeaderProps {
  onMeasurement: (index: number, length: number) => void;
  onTabPress: (index: number) => void;
  activeIndex: number;
}

const TabHeader = ({
  onMeasurement,
  onTabPress,
  activeIndex,
}: TabHeaderProps) => {
  const tabs = defaultTabs;

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
                  color: activeIndex === index ? "#FFB81B" : "black",
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: "Bold",
                  fontSize: 18,
                  paddingHorizontal: 8,
                  color: activeIndex === index ? "#FFB81B" : "black",
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
