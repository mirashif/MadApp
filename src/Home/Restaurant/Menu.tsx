import React from "react";
import {
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Icon, SafeArea, Text } from "../../components";

import { defaultTabs, HEADER_HEIGHT, HEADER_IMAGE_HEIGHT } from "./constants";

const Menu = () => {
  return (
    <SafeArea>
      <HeaderImage />
      <TabHeader />
    </SafeArea>
  );
};

export default Menu;

const TabHeader = () => {
  const tabs = defaultTabs;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        height: HEADER_HEIGHT,
        flexDirection: "row",
      }}
    >
      {tabs.map(({ name }, index) => (
        <View
          key={index}
          style={{
            height: HEADER_HEIGHT,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "pink",
          }}
        >
          <Text
            style={{
              fontFamily: "Bold",
              color: "black",
              fontSize: 18,
              marginHorizontal: 20,
            }}
          >
            • {name}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const HeaderImage = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      style={{
        height: HEADER_IMAGE_HEIGHT,
      }}
      source={{ uri: "https://source.unsplash.com/a66sGfOnnqQ" }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: HEADER_HEIGHT,
          paddingHorizontal: 20,
        }}
      >
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableWithoutFeedback>
        <Text
          style={{
            fontFamily: "Bold",
            fontSize: 24,
            color: "white",
            marginLeft: 15,
          }}
        >
          Cheez
        </Text>
      </View>
    </ImageBackground>
  );
};
