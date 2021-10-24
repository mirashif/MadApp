import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import Animated from "react-native-reanimated";

import { makeStyles, Text } from "../../components";

import { defaultTabs, HEADER_HEIGHT } from "./constants";

interface TabHeaderProps {
  onMeasurement: (index: number, length: number) => void;
  onTabPress: (index: number) => void;
  activeIndex: number;
  scrollViewRefX: React.RefObject<Animated.ScrollView>;
}

const TabHeader = ({
  onMeasurement,
  onTabPress,
  activeIndex,
  scrollViewRefX,
}: TabHeaderProps) => {
  const styles = useStyles();
  const tabs = defaultTabs;

  return (
    <View
      style={{
        height: HEADER_HEIGHT,
      }}
    >
      <Animated.ScrollView
        ref={scrollViewRefX}
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
      </Animated.ScrollView>
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
