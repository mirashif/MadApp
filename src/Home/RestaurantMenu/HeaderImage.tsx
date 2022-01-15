import React from "react";
import { ImageBackground, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Icon, Text } from "../../components";

import { HEADER_HEIGHT, HEADER_IMAGE_HEIGHT } from "./constants";

interface HeaderImageProps {
  y: Animated.SharedValue<number>;
  restaurantName: string;
}

const HeaderImage = ({ y, restaurantName }: HeaderImageProps) => {
  const navigation = useNavigation();

  const animatedStyles = useAnimatedStyle(() => {
    const height = interpolate(
      y.value,
      [0, HEADER_IMAGE_HEIGHT],
      [HEADER_IMAGE_HEIGHT, HEADER_HEIGHT],
      Extrapolate.CLAMP
    );

    const marginBottom = interpolate(
      y.value,
      [0, HEADER_IMAGE_HEIGHT],
      [HEADER_HEIGHT / 2, 0],
      Extrapolate.CLAMP
    );

    return {
      height,
      marginBottom,
    };
  });

  return (
    <Animated.View
      style={[
        {
          // offer 50% visible from bottom
          position: "relative",
        },
        animatedStyles,
      ]}
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
            {restaurantName}
          </Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

export default HeaderImage;
