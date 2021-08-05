import React from "react";
import { ImageBackground } from "react-native";

import { SafeArea, useTheme } from "../../components";
import CategoryHeader from "./CategoryHeader";

import Header from "./Header";
import Offer from "./Offer";

const Menu = () => {
  const theme = useTheme();
  const TOP_RADIUS = theme.borderRadii.xl;

  return (
    <SafeArea>
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

      <CategoryHeader />
    </SafeArea>
  );
};

export default Menu;
