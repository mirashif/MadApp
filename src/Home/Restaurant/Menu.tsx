import React, { useRef } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  interpolateNode,
  Extrapolate,
} from "react-native-reanimated";
import { onScrollEvent, useValue } from "react-native-redash/lib/module/v1";

import { CircularIcon, Icon, SafeArea, Text, useTheme } from "../../components";

import {
  defaultTabs,
  HEADER_HEIGHT,
  HEADER_IMAGE_HEIGHT,
  menu,
} from "./constants";

const Menu = () => {
  const scrollView = useRef<Animated.ScrollView>(null);
  const y = useValue(0);
  const onScroll = onScrollEvent({ y });

  return (
    <SafeArea>
      <View>
        <HeaderImage y={y} />
        <Offer />
      </View>
      <TabHeader />
      <Content onScroll={onScroll} />
    </SafeArea>
  );
};

export default Menu;

const Content = ({ onScroll }) => {
  const theme = useTheme();

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={1}
      onScroll={onScroll}
    >
      {menu.map(({ name, items }, i) => (
        // menu container
        <View
          key={i}
          style={{
            paddingHorizontal: theme.spacing.screen,
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Normal",
              color: theme.colors.foreground,
              marginBottom: 4,
              marginHorizontal: 8,
            }}
          >
            {name}
          </Text>

          {/* items container */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {items.map((item, j) => (
              <Item key={j} {...item} />
            ))}
          </View>
        </View>
      ))}
    </Animated.ScrollView>
  );
};

interface ItemProps {
  image: string;
  name: string;
  price: string;
}

const Item = ({ image, name, price }: ItemProps) => {
  const theme = useTheme();

  return (
    <View
      style={{
        margin: 8,
      }}
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
          color: theme.colors.foreground,
        }}
      >
        {name}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: "Normal",
          fontSize: 11,
          color: theme.colors.darkGray,
        }}
      >
        {price}
      </Text>
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

const HeaderImage = ({ y }) => {
  const navigation = useNavigation();

  const height = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT],
    outputRange: [HEADER_IMAGE_HEIGHT, HEADER_HEIGHT],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <Animated.View
      style={{
        height,
        // offer 50% visible from bottom
        position: "relative",
        marginBottom: HEADER_HEIGHT / 2,
      }}
    >
      <ImageBackground
        style={{
          flex: 1,
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
    </Animated.View>
  );
};
