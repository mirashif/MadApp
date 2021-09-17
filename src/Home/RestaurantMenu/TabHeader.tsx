import React from "react";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";

import { Text } from "../../components";

import { defaultTabs, HEADER_HEIGHT } from "./constants";

interface TabHeaderProps {
  onMeasurement: (index: number, length: number) => void;
  onTabPress: (index: number) => void;
}

const TabHeader = ({ onMeasurement, onTabPress }: TabHeaderProps) => {
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
            <View
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
                  color: "black",
                  fontSize: 18,
                  paddingHorizontal: 8,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: "Bold",
                  color: "black",
                  fontSize: 18,
                  paddingHorizontal: 8,
                }}
              >
                {name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

export default TabHeader;
