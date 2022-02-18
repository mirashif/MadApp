import React from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ScrollView, View } from "react-native";

import type { Theme } from "../../components";
import { makeStyles, Text } from "../../components";
import type { Category } from "../../state/store/CategoryStore";

import type { IMeasurement } from "./constants";
import Item from "./Item";

interface ContentProps {
  categories: Category[] | undefined;
  contentRef: React.RefObject<ScrollView>;
  onItemPress: (itemId: string) => void;
  onMeasurement: (props: IMeasurement) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const Content = ({
  categories,
  contentRef,
  onItemPress,
  onMeasurement,
  onScroll,
}: ContentProps) => {
  const styles = useStyles();
  if (!categories?.length) return null;
  return (
    <ScrollView
      ref={contentRef}
      onScroll={onScroll}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      scrollToOverflowEnabled={true}
    >
      {categories.map(({ data: category, items }) => (
        <View
          key={category.id}
          onLayout={({
            nativeEvent: {
              layout: { y },
            },
          }) => onMeasurement({ categoryId: category.id, y })}
          style={styles.categoryContainer}
        >
          <Text style={styles.categoryName}>{category.name}</Text>
          <View style={styles.itemsContainer}>
            {items.map((item) => (
              <Item key={item.id} {...{ item, onItemPress, onMeasurement }} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Content;

const useStyles = makeStyles((theme: Theme) => ({
  categoryContainer: {
    paddingHorizontal: theme.spacing.screen,
    paddingVertical: 15,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: "Normal",
    color: theme.colors.foreground,
    marginBottom: 4,
    marginHorizontal: 8,
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
}));
