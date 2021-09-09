import React from "react";
import {
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";

import { CircularIcon, Icon, SafeArea, Text, useTheme } from "../../components";

import { defaultTabs, HEADER_HEIGHT, HEADER_IMAGE_HEIGHT } from "./constants";

const Menu = () => {
  return (
    <SafeArea>
      <View>
        <HeaderImage />
        <Offer />
      </View>
      <TabHeader />
    </SafeArea>
  );
};

export default Menu;

const Offer = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        // relative to header image
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <View
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
            color: "white",
          }}
        >
          20% OFF
        </Text>
        <Text
          style={{
            fontFamily: "Normal",
            fontSize: 12,
            color: "white",
          }}
        >
          Enjoy 20% OFF on the entire menu!
        </Text>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          Linking.openURL("tel:8777111223");
        }}
      >
        <CircularIcon name="phone" size={58} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const TabHeader = () => {
  const tabs = defaultTabs;

  return (
    <View
      style={{
        height: HEADER_HEIGHT,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 8,
        }}
      >
        {tabs.map(({ name }, index) => (
          <View
            key={index}
            style={{
              height: HEADER_HEIGHT,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Bold",
                color: "black",
                fontSize: 18,
                paddingHorizontal: 8,
              }}
            >
              •
            </Text>
            <Text
              style={{
                fontFamily: "Bold",
                color: "black",
                fontSize: 18,
                paddingHorizontal: 8,
              }}
            >
              {name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const HeaderImage = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      style={{
        height: HEADER_IMAGE_HEIGHT,
        // offer 50% visible from bottom
        position: "relative",
        marginBottom: HEADER_HEIGHT / 2,
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
