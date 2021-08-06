import React, { RefObject } from "react";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolateNode,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Box, Icon, Text, useTheme } from "../../components";

import Offer from "./Offer";
import TabHeader from "./TabHeader";
import { HEADER_HEIGHT, HEADER_IMAGE_HEIGHT, TabModel } from "./constants";

interface HeaderProps {
  title: string;
  image: string;
  y: Animated.Value<number>;
  tabs: TabModel[];
  scrollView: RefObject<Animated.ScrollView>;
}

const Header = ({ title, image, y, tabs, scrollView }: HeaderProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const height = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT],
    outputRange: [HEADER_IMAGE_HEIGHT + HEADER_HEIGHT, HEADER_HEIGHT],
    extrapolate: Extrapolate.CLAMP,
  });

  const marginBottom = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT / 2, HEADER_IMAGE_HEIGHT],
    outputRange: [HEADER_HEIGHT / 2 + 15, HEADER_HEIGHT / 2, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const opacity = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT - HEADER_HEIGHT, HEADER_IMAGE_HEIGHT],
    outputRange: [1, 0, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const translateY = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT - HEADER_HEIGHT, HEADER_IMAGE_HEIGHT],
    outputRange: [0, 0, -HEADER_IMAGE_HEIGHT],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: insets.top,
      }}
    >
      <Animated.View
        style={{
          height,
          position: "relative",
        }}
      >
        <ImageBackground
          style={{
            flex: 1,
          }}
          source={{ uri: image }}
        >
          {/* HeaderBar */}
          <Box
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: HEADER_HEIGHT,
              paddingHorizontal: theme.spacing.xl,
            }}
          >
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="white" />
            </TouchableWithoutFeedback>
            <Text
              style={{
                fontFamily: "Bold",
                fontSize: 24,
                color: theme.colors.primaryContrast,
                marginLeft: theme.spacing.m,
              }}
            >
              {title}
            </Text>
          </Box>
        </ImageBackground>

        {/* Offer */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: -(HEADER_HEIGHT / 2),
            left: 0,
            right: 0,
            opacity,
            transform: [
              {
                translateY,
              },
            ],
          }}
        >
          <Offer
            title="20% OFF"
            description="Enjoy 20% OFF on the entire menu!"
            telephone="8777111223"
          />
        </Animated.View>
      </Animated.View>

      {/* OFFER MARGIN BOTTOM */}
      <Animated.View
        style={{
          marginBottom,
        }}
      />

      <Box backgroundColor="background">
        <TabHeader {...{ y, tabs, scrollView }} />
      </Box>
    </View>
  );
};

export default Header;
