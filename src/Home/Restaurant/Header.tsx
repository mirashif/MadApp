import type { RefObject } from "react";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolateNode,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Linking from "expo-linking";

import { Box, CircularIcon, Icon, Text, useTheme } from "../../components";

import type { TabModel } from ".";
import { HEADER_HEIGHT, HEADER_IMAGE_HEIGHT } from ".";

interface HeaderProps {
  title: string;
  image: string;
  y: Animated.SharedValue<number>;
  tabs: TabModel[];
  ContentScrollViewRef: RefObject<Animated.ScrollView>;
}

const Header = ({ title, image, y }: HeaderProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const height = interpolateNode(y.value, {
    inputRange: [0, HEADER_IMAGE_HEIGHT],
    outputRange: [HEADER_IMAGE_HEIGHT + HEADER_HEIGHT, HEADER_HEIGHT],
    extrapolate: Extrapolate.CLAMP,
  });

  const marginBottom = interpolateNode(y.value, {
    inputRange: [0, HEADER_IMAGE_HEIGHT / 2, HEADER_IMAGE_HEIGHT],
    outputRange: [HEADER_HEIGHT / 2 + 15, HEADER_HEIGHT / 2, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const opacity = interpolateNode(y.value, {
    inputRange: [0, HEADER_IMAGE_HEIGHT - HEADER_HEIGHT, HEADER_IMAGE_HEIGHT],
    outputRange: [1, 0, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const translateY = interpolateNode(y.value, {
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
          <Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 30,
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
        </Animated.View>
      </Animated.View>

      {/* OFFER MARGIN BOTTOM */}
      <Animated.View
        style={{
          marginBottom,
        }}
      />
    </View>
  );
};

export default Header;
