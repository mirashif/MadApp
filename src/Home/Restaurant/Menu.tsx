import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { onScrollEvent, useValue } from "react-native-redash/lib/module/v1";

import { Box, SafeArea, useTheme } from "../../components";

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

import Header from "./Header";
import Items from "./Items";
import Offer from "./Offer";
import TabHeader from "./TabHeader";

export interface TabModel {
  name: string;
  anchor: number;
}

const Menu = () => {
  const theme = useTheme();
  const scrollView = useRef<Animated.ScrollView>(null);
  const [tabs, setTabs] = useState(defaultTabs);
  const y = useValue(0);
  const onScroll = onScrollEvent({ y });

  return (
    <SafeArea>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollView}
        scrollEventThrottle={1}
        {...{ onScroll }}
      >
        <Offer
          title="20% OFF"
          description="Enjoy 20% OFF on the entire menu!"
          telephone="8777111223"
        />

        <TabHeader {...{ tabs }} />

        {menu.map(({ name, items: menuItems }, index) => (
          <Box style={{ marginVertical: 15 }} key={index}>
            <Items name={name} items={menuItems} />
          </Box>
        ))}
      </Animated.ScrollView>
      <Header
        title="Cheez"
        image="https://source.unsplash.com/a66sGfOnnqQ"
        {...{ y, tabs, scrollView }}
      />
    </SafeArea>
  );
};

export default Menu;
