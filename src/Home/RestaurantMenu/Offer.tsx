import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import * as Linking from "expo-linking";
import Animated, {
  interpolateNode,
  Extrapolate,
} from "react-native-reanimated";

import { CircularIcon, Text, useTheme } from "../../components";

import { HEADER_IMAGE_HEIGHT } from "./constants";

interface OfferProps {
  y: Animated.SharedValue<number>;
}

const Offer = ({ y }: OfferProps) => {
  const theme = useTheme();

  const opacity = interpolateNode(y.value, {
    inputRange: [0, HEADER_IMAGE_HEIGHT / 2],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const translateY = interpolateNode(y.value, {
    inputRange: [HEADER_IMAGE_HEIGHT / 2, HEADER_IMAGE_HEIGHT],
    outputRange: [0, -HEADER_IMAGE_HEIGHT],
    extrapolateLeft: Extrapolate.CLAMP,
  });

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
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
    </Animated.View>
  );
};

export default Offer;
