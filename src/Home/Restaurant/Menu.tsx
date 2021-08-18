import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

  useEffect(() => {
    // TODO: update anchor values
    const anchor = measurements.reduce(
      (accumulator, value) => accumulator + value,
      0
    );

    setAnchors([...anchors]);
  }, [measurements, anchors]);

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
                  measurements[index] = Math.round(width);
                  setMeasurements([...measurements]);
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
