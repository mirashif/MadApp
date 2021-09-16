import React from "react";
import { ImageBackground, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  interpolateNode,
  Extrapolate,
} from "react-native-reanimated";

import { Icon, Text } from "../../components";

import { HEADER_HEIGHT, HEADER_IMAGE_HEIGHT } from "./constants";

const HeaderImage = ({ y }) => {
  const navigation = useNavigation();

  const height = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT],
    outputRange: [HEADER_IMAGE_HEIGHT, HEADER_HEIGHT],
    extrapolate: Extrapolate.CLAMP,
  });

  const marginBottom = interpolateNode(y, {
    inputRange: [0, HEADER_IMAGE_HEIGHT],
    outputRange: [HEADER_HEIGHT / 2, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <Animated.View
      style={{
        height,
        // offer 50% visible from bottom
        position: "relative",
        marginBottom,
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

export default HeaderImage;
