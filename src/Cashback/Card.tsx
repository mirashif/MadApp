import React from "react";
import { Image, ImageBackground, View } from "react-native";

import { Text, useTheme } from "../components";

const cardBackgroundImage = {
  src: require("./assets/card.png"),
  height: 195,
};

const madAppLogo = {
  src: require("./assets/mad-logo.png"),
  height: 60,
};

export const assets = [cardBackgroundImage.src, madAppLogo.src];

interface CardProps {
  points: string;
  name: string;
}

const Card = ({ points, name }: CardProps) => {
  const theme = useTheme();

  return (
    <ImageBackground
      style={{
        height: cardBackgroundImage.height,
      }}
      imageStyle={{
        borderRadius: theme.borderRadii.xl,
        overflow: "hidden",
      }}
      source={cardBackgroundImage.src}
    >
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          paddingTop: 40,
        }}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "Normal",
            fontSize: 17,
          }}
        >
          YOU HAVE
        </Text>
        <Text
          style={{
            color: "white",
            fontFamily: "Bold",
            fontSize: 56,
          }}
        >
          {points}
        </Text>
        <Text
          style={{
            color: "white",
            fontFamily: "Normal",
            fontSize: 14,
          }}
        >
          Points
        </Text>
      </View>
      <View
        style={{
          alignItems: "flex-end",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "Normal",
            fontSize: 17,
            paddingBottom: 20,
          }}
        >
          {name}
        </Text>
        <Image style={{ height: madAppLogo.height }} source={madAppLogo.src} />
      </View>
    </ImageBackground>
  );
};

export default Card;
