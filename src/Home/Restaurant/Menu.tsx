import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Image,
  ImageBackground,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateNode,
  useValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Box,
  CircularIcon,
  Icon,
  SafeArea,
  Text,
  useTheme,
} from "../../components";

import type { TabModel } from "./Constants";
import { HEADER_IMAGE_HEIGHT, HEADER_HEIGHT } from "./Constants";

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

export const defaultTabs: TabModel[] = menu.map(({ name }) => ({
  name,
  width: 0,
  anchor: 0,
  contentAnchor: 0,
}));

const Menu = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const y = useValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabs, setTabs] = useState(defaultTabs);
  const [tabWidthValues, setTabWidthValues] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );
  const [tabAnchors, setTabAnchors] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );

  const TabScrollViewRef = useRef<ScrollView>(null);
  const ContentScrollViewRef = useRef<Animated.ScrollView>(null);

  const height = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT],
    outputRange: [HEADER_IMAGE_HEIGHT + HEADER_HEIGHT, HEADER_HEIGHT],
    extrapolate: Extrapolate.CLAMP,
  });
  const marginBottom = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT / 2, HEADER_IMAGE_HEIGHT],
    outputRange: [HEADER_HEIGHT / 2 + 15, HEADER_HEIGHT / 2, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const opacity = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT - HEADER_HEIGHT, HEADER_IMAGE_HEIGHT],
    outputRange: [1, 0, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const translateY = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT - HEADER_HEIGHT, HEADER_IMAGE_HEIGHT],
    outputRange: [0, 0, -HEADER_IMAGE_HEIGHT],
    extrapolate: Extrapolate.CLAMP,
  });

  const onMeasurement = (
    index: number,
    tab: { name: string; contentAnchor: number }
  ) => {
    tabs[index] = { ...tabs[index], ...tab };
    setTabs([...tabs]);
  };

  const onScroll = ({
    nativeEvent: {
      contentOffset: { y: contentOffsetY },
    },
  }: {
    nativeEvent: { contentOffset: { y: number } };
  }) => {
    y.value = contentOffsetY;
  };

  useEffect(() => {
    TabScrollViewRef.current?.scrollTo({
      x: tabAnchors[activeIndex],
      y: 0,
      animated: true,
    });

    ContentScrollViewRef.current?.getNode().scrollTo({
      x: 0,
      y: tabs[activeIndex].contentAnchor,
      animated: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    console.log({ height });
  }, [height]);

  return (
    <SafeArea>
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
                layout: { y: contentAnchor },
              },
            }) =>
              onMeasurement(i, {
                name: menuName,
                contentAnchor,
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

      {/* HEADER */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top,
        }}
      >
        <Animated.View
          style={{
            height,
            position: "relative",
          }}
        >
          <ImageBackground
            style={{
              flex: 1,
            }}
            source={{ uri: "https://source.unsplash.com/a66sGfOnnqQ" }}
          >
            {/* HeaderBar */}
            <Box
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: HEADER_HEIGHT,
                paddingHorizontal: theme.spacing.xl,
              }}
            >
              <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="white" />
              </TouchableWithoutFeedback>
              <Text
                style={{
                  fontFamily: "Bold",
                  fontSize: 24,
                  color: theme.colors.primaryContrast,
                  marginLeft: theme.spacing.m,
                }}
              >
                Cheez
              </Text>
            </Box>
          </ImageBackground>

          {/* Offer */}
          <Animated.View
            style={{
              position: "absolute",
              bottom: -(HEADER_HEIGHT / 2),
              left: 0,
              right: 0,
              opacity,
              transform: [
                {
                  translateY,
                },
              ],
            }}
          >
            <Box
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 30,
              }}
            >
              <Box
                style={{
                  flex: 1,
                  borderRadius: theme.borderRadii.l,
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 18,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Bold",
                    fontSize: 16,
                    color: theme.colors.primaryContrast,
                  }}
                >
                  20% OFF
                </Text>
                <Text
                  style={{
                    fontFamily: "Normal",
                    fontSize: 12,
                    color: theme.colors.primaryContrast,
                  }}
                >
                  Enjoy 20% OFF on the entire menu!
                </Text>
              </Box>
              <TouchableWithoutFeedback
                onPress={() => {
                  Linking.openURL("tel:8777111223");
                }}
              >
                <CircularIcon name="phone" size={58} />
              </TouchableWithoutFeedback>
            </Box>
          </Animated.View>
        </Animated.View>

        {/* OFFER MARGIN BOTTOM */}
        <Animated.View
          style={{
            marginBottom,
          }}
        />

        {/* TabHeader */}
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: 20,
            backgroundColor: "white",
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
                  const _measurements = tabWidthValues;
                  const _anchors = tabAnchors;

                  _measurements[tabIndex] = Math.round(width);
                  setTabWidthValues([..._measurements]);

                  let tabAnchor = 0;
                  _anchors.forEach((_, anchorIndex) => {
                    if (anchorIndex < tabIndex) {
                      tabAnchor += _measurements[tabIndex];
                    }
                  });
                  _anchors[tabIndex] = tabAnchor;
                  setTabAnchors([..._anchors]);
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
      </Animated.View>
    </SafeArea>
  );
};

export default Menu;
