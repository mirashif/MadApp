import React from "react";
import { ScrollView, TouchableWithoutFeedback, View } from "react-native";

import { makeStyles, Text } from "../../components";
import type { Category } from "../../state/store/CategoryStore";

import type { IMeasurement } from "./constants";
import { HEADER_HEIGHT } from "./constants";

interface TabHeaderProps {
  activeTabId: string | undefined;
  categories: Category[] | undefined;
  onMeasurement: (props: IMeasurement) => void;
  onTabPress: (categoryId: string) => void;
  tabRef: React.RefObject<ScrollView>;
}

const TabHeader = ({
  activeTabId,
  categories,
  onMeasurement,
  onTabPress,
  tabRef,
}: TabHeaderProps) => {
  const styles = useStyles();
  if (!categories?.length) return null;
  return (
    <View style={{ height: HEADER_HEIGHT }}>
      <ScrollView
        ref={tabRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {categories.map(({ data: category }) => {
          const isActive = activeTabId === category.id;
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
                }) => onMeasurement({ categoryId: category.id, x: x - 8 })}
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
  },
}));
