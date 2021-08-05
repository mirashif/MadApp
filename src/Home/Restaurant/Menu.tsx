import React from "react";
import { ImageBackground } from "react-native";

import { SafeArea, useTheme } from "../../components";

import Header from "./Header";
import Offer from "./Offer";

const Menu = () => {
  const theme = useTheme();
  return (
    <SafeArea>
      <ImageBackground
        source={{ uri: "https://source.unsplash.com/a66sGfOnnqQ" }}
        style={{
          height: 220,
        }}
        imageStyle={{
          borderTopLeftRadius: theme.borderRadii.l,
          borderTopRightRadius: theme.borderRadii.l,
        }}
      >
        <Header title="Cheez" />
      </ImageBackground>

      <Offer
        title="20% OFF"
        description="Enjoy 20% OFF on the entire menu!"
        telephone="8777111223"
      />
    </SafeArea>
  );
};

export default Menu;
