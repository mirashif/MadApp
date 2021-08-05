import React from "react";
import { ImageBackground, ScrollView } from "react-native";

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
  { title: "Classic Pizzas", items },
  { title: "Gourmet Pizzas", items },
  { title: "Tomato Soups", items },
  { title: "Potato Mehedi", items },
];

import Header from "./Header";
import Items from "./Items";
import Offer from "./Offer";

const Menu = () => {
  const theme = useTheme();
  const TOP_RADIUS = theme.borderRadii.xl;

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: "https://source.unsplash.com/a66sGfOnnqQ" }}
          style={{
            height: 220,
          }}
          imageStyle={{
            borderTopLeftRadius: TOP_RADIUS,
            borderTopRightRadius: TOP_RADIUS,
          }}
        >
          <Header title="Cheez" />
        </ImageBackground>

        <Offer
          title="20% OFF"
          description="Enjoy 20% OFF on the entire menu!"
          telephone="8777111223"
        />

        {menu.map(({ title, items: menuItems }, index) => (
          <Box style={{ marginBottom: 30 }} key={index}>
            <Items name={title} items={menuItems} />
          </Box>
        ))}
      </ScrollView>
    </SafeArea>
  );
};

export default Menu;
