import React from "react";
import Animated from "react-native-reanimated";

import { Box } from "../../components";

import { HEADER_HEIGHT, HEADER_IMAGE_HEIGHT, TabModel } from "./constants";
import Items from "./Items";

const TOP_AREA_HEIGHT =
  HEADER_HEIGHT * 2 + HEADER_IMAGE_HEIGHT + (HEADER_HEIGHT / 2 + 15); // header, tabsheader, image, offer

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

interface ContentProps {
  y: Animated.Node<number>;
  onMeasurement: (index: number, tab: TabModel) => void;
}

const Content = ({ y, onMeasurement }: ContentProps) => {
  return (
    <Box style={{ paddingTop: TOP_AREA_HEIGHT }}>
      {menu.map(({ name, items: menuItems }, index) => (
        <Box style={{ marginVertical: 15 }} key={index}>
          <Items name={name} items={menuItems} />
        </Box>
      ))}
    </Box>
  );
};

export default Content;
