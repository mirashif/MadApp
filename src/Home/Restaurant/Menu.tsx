import React from "react";
import * as Linking from "expo-linking";
import { ImageBackground, TouchableWithoutFeedback } from "react-native";

import { Box, CircularIcon, SafeArea, Text, useTheme } from "../../components";

import Header from "./Header";

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
      <Box
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          top: -28,
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
    </SafeArea>
  );
};

export default Menu;
