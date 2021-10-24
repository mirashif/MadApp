import React, { useState } from "react";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";
import type Animated from "react-native-reanimated";
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { makeStyles, Text } from "../../components";

import { defaultTabs, HEADER_HEIGHT } from "./constants";

interface TabHeaderProps {
  onMeasurement: (index: number, length: number) => void;
  onTabPress: (index: number) => void;
  y: Animated.SharedValue<number>;
}

const TabHeader = ({ onMeasurement, onTabPress, y }: TabHeaderProps) => {
  const styles = useStyles();
  const tabs = defaultTabs;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleActiveIndex = (v) => {
    if (v < 500) setActiveIndex(0);
    else if (v > 550) setActiveIndex(1);
  };

  useDerivedValue(() => {
    runOnJS(handleActiveIndex)(y.value);
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
            <View
              onLayout={({
                nativeEvent: {
                  layout: { x: length },
                },
              }) => onMeasurement(index, length)}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeIndex === index ? "#FFB81B" : "black" },
                ]}
              >
                •
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeIndex === index ? "#FFB81B" : "black" },
                ]}
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

const useStyles = makeStyles(() => ({
  tab: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
  tabLabel: {
    fontFamily: "Bold",
    fontSize: 18,
    paddingHorizontal: 8,
    color: "#FFB81B",
  },
}));
