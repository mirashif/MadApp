import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, TouchableWithoutFeedback } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

import { Box, SafeArea, Text } from "../../components";

const items = [
  {
    name: "Long Hongdae Nights",
    description:
      "Korean fried chicken glazed with Gochujang, garnished with sesame & spring onions, served with fries & Miss Miu Mayo",
    price: "৳ 26",
    image: "https://source.unsplash.com/a66sGfOnnqQ",
  },
  {
    name: "Late Sunset",
    description:
      "Korean fried chicken starter with dirty cheese sauce and Artisan Hot Sauce - the naughty version new, favourite",
    price: "৳ 13.50",
    image: "https://source.unsplash.com/a66sGfOnnqQ",
  },
  {
    name: "Cabbage Kimchi",
    description: "Portion, vegan",
    price: "৳ 5.00",
    image: "https://source.unsplash.com/a66sGfOnnqQ",
  },
  {
    name: "Namur by Pieces",
    description:
      "Homemade steamed dim sum with minced pork, shiitake mushrooms and smokey honey flavour, four pcs",
    price: "৳ 10.50",
    image: "https://source.unsplash.com/a66sGfOnnqQ",
  },
  {
    name: "Silim Lights",
    description:
      "Beef Bibimbap, sesame oil, rice, beans, spinach, carrots, spring onions, Chinese cabbage, shiitake mushrooms, roasted onions and egg",
    price: "৳ 26.50",
    image: "https://source.unsplash.com/a66sGfOnnqQ",
  },
];

const menu = [
  { name: "Classic Pizzas", items },
  { name: "Gourmet Pizzas", items },
  { name: "Tomato Soups", items },
  { name: "Potato Mehedi", items },
];

export const defaultTabs = menu.map(({ name }) => ({ name, anchor: 0 }));

const Menu = () => {
  const y = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabs, setTabs] = useState(defaultTabs);
  const [measurements, setMeasurements] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );
  const [anchors, setAnchors] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );

  const onMeasurement = (
    index: number,
    tab: { name: string; anchor: number }
  ) => {
    tabs[index] = tab;
    setTabs([...tabs]);
  };

  const TabScrollViewRef = useRef<ScrollView>(null);
  const ContentScrollViewRef = useRef<Animated.ScrollView>(null);

  useEffect(() => {
    TabScrollViewRef.current?.scrollTo({
      x: anchors[activeIndex],
      y: 0,
      animated: true,
    });

    ContentScrollViewRef.current?.getNode().scrollTo({
      x: 0,
      y: tabs[activeIndex].anchor,
      animated: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const onScroll = ({
    nativeEvent: {
      contentOffset: { y: contentOffsetY },
    },
  }: {
    nativeEvent: { contentOffset: { y: number } };
  }) => {
    y.value = contentOffsetY;
  };

  return (
    <SafeArea>
      {/* TabHeader */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
        ref={TabScrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab, tabIndex) => (
          <TouchableWithoutFeedback
            onPress={() => setActiveIndex(tabIndex)}
            key={tabIndex}
          >
            <Box
              // active={index === activeIndex}
              onLayout={({
                nativeEvent: {
                  layout: { width },
                },
              }) => {
                const _measurements = measurements;
                const _anchors = anchors;

                _measurements[tabIndex] = Math.round(width);
                setMeasurements([..._measurements]);

                let tabAnchor = 0;
                _anchors.forEach((_, anchorIndex) => {
                  if (anchorIndex < tabIndex) {
                    tabAnchor += _measurements[tabIndex];
                  }
                });
                _anchors[tabIndex] = tabAnchor;
                setAnchors([..._anchors]);
              }}
              style={{
                flexDirection: "row",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  fontSize: 18,
                  color: activeIndex === tabIndex ? "#FFB81B" : "black",
                  marginRight: 18,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: "Bold",
                  fontSize: 18,
                  color: activeIndex === tabIndex ? "#FFB81B" : "black",
                  marginRight: 18,
                }}
              >
                {tab.name}
              </Text>
            </Box>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>

      {/* Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        ref={ContentScrollViewRef}
        scrollEventThrottle={1}
        onScroll={onScroll}
      >
        {menu.map(({ name: menuName, items: menuItems }, i) => (
          <Box
            style={{ paddingVertical: 15 }}
            key={i}
            onLayout={({
              nativeEvent: {
                layout: { y: anchor },
              },
            }) =>
              onMeasurement(i, {
                name: menuName,
                anchor,
              })
            }
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Normal",
                color: "red",
                marginBottom: 4,
                marginHorizontal: 8,
              }}
            >
              {menuName}
            </Text>
            <Box
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {menuItems.map(({ image, name, price }, j) => (
                <Box
                  style={{
                    margin: 8,
                  }}
                  key={j}
                >
                  <Image
                    style={{
                      height: 150,
                      width: 150,
                      borderRadius: 12,
                      marginBottom: 7,
                    }}
                    source={{ uri: image }}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "Bold",
                      fontSize: 11,
                      color: "black",
                    }}
                  >
                    {name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "Normal",
                      fontSize: 11,
                      color: "gray",
                    }}
                  >
                    {price}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Animated.ScrollView>
    </SafeArea>
  );
};

export default Menu;
