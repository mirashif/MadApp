import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";
import Markdown from "react-native-markdown-display";

import type { HomeStackProps } from "..";
import type { Theme } from "../../components";
import { Box, Icon, makeStyles, SafeArea, Text } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { RestaurantStore } from "../../state/store/RestaurantStore";
import type { StoryStore } from "../../state/store/StoryStore";

const Story = ({ route, navigation }: HomeStackProps<"Story">) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get("window");

  const { id } = route.params;

  const restaurants: RestaurantStore = useAppState("restaurants");
  const stories: StoryStore = useAppState("stories");

  const story = stories.get(id);
  const restaurantId = story?.data.restaurantID as string;
  const caption = story?.data.caption;
  const target = story?.data.target;
  const storyImageURI = story?.data.imageURI;

  const restaurant = restaurants.get(restaurantId);
  const restaurantName = restaurant?.data.name;
  const restaurantLogoURI = restaurant?.data.logoImageURI;

  const handleSwipeUp = () => {
    if (!target) return;
    navigation.navigate("Restaurant", {
      restaurantId,
      target,
    });
  };

  if (!story || !restaurant) return null;
  return (
    <SafeArea>
      <Box flex={1}>
        <ImageBackground
          source={{ uri: storyImageURI }}
          resizeMode="cover"
          style={styles.image}
        >
          <Box
            px="screen"
            py="l"
            flexDirection="row"
            alignItems="center"
            style={styles.header}
          >
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
              <Icon name="x" size={24} color="white" />
            </TouchableWithoutFeedback>
            <Image source={{ uri: restaurantLogoURI }} style={styles.avatar} />
            <Box px="l" flexDirection="column" alignItems="flex-start">
              <Text style={styles.restaurantName}>{restaurantName}</Text>
            </Box>
          </Box>

          <GestureRecognizer
            onSwipeUp={handleSwipeUp}
            style={[
              styles.gestureContainer,
              {
                marginBottom: insets.bottom,
                marginTop: height * 0.2,
              },
            ]}
          >
            {caption && (
              <Box style={styles.captionContainer}>
                <Markdown
                  style={{
                    body: { color: "white", fontWeight: "bold", fontSize: 12 },
                  }}
                >
                  {caption}
                </Markdown>
              </Box>
            )}
            {target && (
              <Box
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                my="l"
              >
                <Icon name="chevron-up" size={24} color="white" />
                <Text style={styles.swipeUpText}>Swipe up to browse</Text>
              </Box>
            )}
          </GestureRecognizer>
        </ImageBackground>
      </Box>
    </SafeArea>
  );
};

export default Story;

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.gray,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    resizeMode: "cover",
    backgroundColor: theme.colors.background,
    marginLeft: theme.spacing.xl,
  },
  header: {
    position: "absolute",
    width: "100%",
    top: 0,
  },
  restaurantName: {
    fontSize: 15,
    fontFamily: "Bold",
    color: "white",
  },
  gestureContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  captionContainer: {
    marginHorizontal: 70,
    marginBottom: 30,
  },
  swipeUpText: {
    fontSize: 15,
    fontFamily: "Bold",
    color: "white",
  },
}));
