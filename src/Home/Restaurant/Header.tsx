import React, { RefObject } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ImageBackground,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolateNode,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Box, Icon, Text, useTheme } from "../../components";

import TabHeader from "./TabHeader";
import { TabModel } from "./Menu";

const HEADER_IMAGE_HEIGHT = 220;
export const HEADER_HEIGHT = 52;

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
    outputRange: [HEADER_IMAGE_HEIGHT + HEADER_HEIGHT, HEADER_HEIGHT * 2],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: insets.top,
      }}
    >
      <Animated.View
        style={{
          height,
        }}
      >
        <ImageBackground
          style={{
            flex: 1,
          }}
          source={{ uri: image }}
          imageStyle={{
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          }}
        >
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

        <TabHeader {...{ y, tabs, scrollView }} />
      </Animated.View>
    </View>
  );
};

export default Header;
