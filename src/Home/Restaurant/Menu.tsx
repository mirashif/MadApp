import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, TouchableWithoutFeedback } from "react-native";

import { Box, SafeArea, Text } from "../../components";

const menu = [
  { name: "Classic Pizzas" },
  { name: "Gourmet Pizzas" },
  { name: "Tomato Soups" },
  { name: "Potato Mehedi" },
  { name: "Classic Pizzas2" },
  { name: "Gourmet Pizzas2" },
  { name: "Tomato Soups2" },
  { name: "Potato Mehedi2" },
];

const tabs = menu.map(({ name }) => ({ name }));

const Menu = () => {
  const [tabWidth, setTabWidth] = useState(new Array(menu.length).fill(0));
  const [tabAnchor, setTabAnchor] = useState(new Array(menu.length).fill(0));

  const TabScrollViewRef = useRef<ScrollView>(null);

  const handleTabScroll = (index: number) => {
    TabScrollViewRef.current?.scrollTo({
      x: tabAnchor[index],
      y: 0,
      animated: true,
    });
  };

  const calculateAnchors = useMemo(
    (currentIndex: number) => {
      console.log(tabs);
      tabs.forEach((tab) => {
        let anchor = 0;
        _tabs.forEach((t, i) => {
          if (i < index) {
            anchor += t.width;
          }
        });
        _tabs[index].anchor = anchor;
        setTabs(_tabs);
      });
    },
    [tabs]
  );

  return (
    <SafeArea>
      <Box flexDirection="row" my="xl">
        <ScrollView
          ref={TabScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map((tab, index) => (
            <TouchableWithoutFeedback
              onPress={() => handleTabScroll(index)}
              key={index}
            >
              <Box
                onLayout={({
                  nativeEvent: {
                    layout: { width },
                  },
                }) => {
                  tabWidth[index] = Math.round(width);

                  setTabWidth([...tabWidth]);

                  calculateAnchors(index);
                }}
                py="m"
                px="xl"
                backgroundColor="primary"
              >
                <Text color="primaryContrast">{tab.name}</Text>
              </Box>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </Box>
    </SafeArea>
  );
};

export default Menu;
