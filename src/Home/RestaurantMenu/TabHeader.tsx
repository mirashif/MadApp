import React from "react";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";

import type { Theme } from "../../components";
import { makeStyles, Text } from "../../components";

import { defaultTabs, HEADER_HEIGHT } from "./constants";

interface TabHeaderProps {
  onMeasurement: (index: number, length: number) => void;
  onTabPress: (index: number) => void;
}

const TabHeader = ({ onMeasurement, onTabPress }: TabHeaderProps) => {
  const styles = useStyles();
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
              style={styles.tab}
            >
              <Text style={styles.tabLabel}>•</Text>
              <Text style={styles.tabLabel}>{name}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

export default TabHeader;

const useStyles = makeStyles((theme: Theme) => ({
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
