import React, { useRef, useState } from "react";
import { ScrollView, TouchableWithoutFeedback } from "react-native";

import { Box, SafeArea, Text } from "../../components";

const menu = [
  { name: "Classic Pizzas" },
  { name: "Gourmet Pizzas" },
  { name: "Tomato Soups" },
  { name: "Potato Mehedi" },
  // { name: "Classic Pizzas2" },
  // { name: "Gourmet Pizzas2" },
  // { name: "Tomato Soups2" },
  // { name: "Potato Mehedi2" },
];

const tabs = menu.map(({ name }) => ({ name }));

const Menu = () => {
  const [measurements, setMeasurements] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );
  const [anchors, setAnchors] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );

  const TabScrollViewRef = useRef<ScrollView>(null);

  const handleTabScroll = (index: number) => {
    TabScrollViewRef.current?.scrollTo({
      x: anchors[index],
      y: 0,
      animated: true,
    });
  };

  return (
    <SafeArea>
      <Box flexDirection="row" my="xl">
        <ScrollView
          ref={TabScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map((tab, tabIndex) => (
            <TouchableWithoutFeedback
              onPress={() => handleTabScroll(tabIndex)}
              key={tabIndex}
            >
              <Box
                onLayout={({
                  nativeEvent: {
                    layout: { width },
                  },
                }) => {
                  measurements[tabIndex] = Math.round(width);
                  setMeasurements([...measurements]);

                  // anchors[index] = measurements[index];

                  const accumulator = 0;
                  anchors.forEach((anchor, anchorIndex) => {
                    if (anchorIndex < tabIndex) {
                      anchor = accumulator + measurements[tabIndex];
                    }
                  });

                  setAnchors([...anchors]);
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
