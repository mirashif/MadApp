import React from "react";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";

import { makeStyles, Text } from "../../components";
import type { Category } from "../../state/store/CategoryStore";

import { HEADER_HEIGHT } from "./constants";

interface TabHeaderProps {
  activeId: string;
  categories: Category[];
  onMeasurement: (categoryId: string, x: number) => void;
  onTabPress: (categoryId: string) => void;
  tabRef: React.RefObject<ScrollView>;
}

const TabHeader = ({
  activeId,
  categories,
  onMeasurement,
  onTabPress,
  tabRef,
}: TabHeaderProps) => {
  const styles = useStyles();
  return (
    <ScrollView
      ref={tabRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 8,
        height: HEADER_HEIGHT,
      }}
    >
      {categories.map(({ data: category }) => {
        const isActive = activeId === category.id;
        return (
          <TouchableWithoutFeedback
            onPress={() => onTabPress(category.id)}
            key={category.id}
          >
            <View
              onLayout={({
                nativeEvent: {
                  layout: { x },
                },
              }) => onMeasurement(category.id, x)}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? "#FFB81B" : "black" },
                ]}
              >
                •
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? "#FFB81B" : "black" },
                ]}
              >
                {category.name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </ScrollView>
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
  },
}));
