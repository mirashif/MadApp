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
  const [measurements, setMeasurements] = useState<number[]>(
    new Array(tabs.length).fill(0)
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
    console.log(measurements);
  }, [measurements]);

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
                  measurements[index] = width;
                  setMeasurements([...measurements]);

                  // const _tabs = tabs;
                  // _tabs[index].width = width;

                  // let anchor = 0;
                  // _tabs.forEach((t, i) => {
                  //   if (i < index) {
                  //     anchor += t.width;
                  //   }
                  // });
                  // _tabs[index].anchor = anchor;
                  // setTabs(_tabs);
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
