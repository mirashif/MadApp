import React from "react";
import { ImageBackground, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Icon, Text, useTheme } from "../../components";

import { HEADER_HEIGHT, HEADER_IMAGE_HEIGHT } from "./constants";

interface HeaderImageProps {
  contentScroll: Animated.SharedValue<number>;
  restaurantName: string | undefined;
  imageURI: string | undefined;
}

const HeaderImage = ({
  contentScroll,
  restaurantName,
  imageURI: uri,
}: HeaderImageProps) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const animatedStyles = useAnimatedStyle(() => {
    const height = interpolate(
      contentScroll.value,
      [0, HEADER_IMAGE_HEIGHT],
      [HEADER_IMAGE_HEIGHT, HEADER_HEIGHT],
      Extrapolate.CLAMP
    );

    const marginBottom = interpolate(
      contentScroll.value,
      [0, HEADER_IMAGE_HEIGHT],
      [HEADER_HEIGHT / 2, 0],
      Extrapolate.CLAMP
    );

    return {
      height,
      marginBottom,
    };
  });

  if (!restaurantName && !uri) return null;
  return (
    <Animated.View style={[{ position: "relative" }, animatedStyles]}>
      <ImageBackground
        style={{
          flex: 1,
          backgroundColor: theme.colors.gray,
        }}
        source={{ uri }}
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
