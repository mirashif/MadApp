import React, { useEffect, useRef, useState } from "react";
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

const Menu = () => {
  const [tabs, setTabs] = useState(
    menu.map(({ name }) => ({ name, width: 0, anchor: 0 }))
  );

  const TabScrollViewRef = useRef<ScrollView>(null);

  const handleTabScroll = (index: number) => {
    TabScrollViewRef.current?.scrollTo({
      x: tabs[index].anchor,
      y: 0,
      animated: true,
    });
  };

  useEffect(() => {
    console.log(tabs);
  }, [tabs]);

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
                  tabs[index].width = Math.round(width);

                  // if (index === 0) _tabs[index].anchor = 0;
                  // else
                  //   _tabs[index].anchor =
                  //     _tabs[index - 1].anchor + _tabs[index - 1].width;

                  setTabs([...tabs]);
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
