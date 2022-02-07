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
  const restaurant = restaurants.get(story?.data.restaurantID || "");

  if (!story || !restaurant) return null;

  // TODO: Add swipe navigation to restaurant?
  return (
    <SafeArea>
      <Box flex={1}>
        <ImageBackground
          source={{ uri: story.data.imageURI }}
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

            {/* TODO: Add avatar from new design */}
            <Image
              source={{ uri: restaurant.data.logoImageURI }}
              style={styles.avatar}
            />

            <Box px="l" flexDirection="column" alignItems="flex-start">
              <Text
                style={{ fontSize: 15, fontFamily: "Bold", color: "white" }}
              >
                {restaurant.data.name}
              </Text>
              <Text
                style={{ fontSize: 11, fontFamily: "Normal", color: "white" }}
              >
                NO DOC:30 mins
              </Text>
            </Box>
          </Box>

          <GestureRecognizer
            onSwipeUp={
              () => navigation.goBack()
              // navigation.navigate("RestaurantMenu", {
              //   restaurantId: "44f9bb5d-b5c5-4d55-9a1a-a91912d45f2f",
              // })
            }
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: insets.bottom,
              marginTop: height * 0.2,
            }}
          >
            {story.data.caption && (
              <Box
                style={{
                  marginHorizontal: 70,
                  marginBottom: 30,
                }}
              >
                <Markdown
                  style={{
                    body: { color: "white", fontWeight: "bold", fontSize: 12 },
                  }}
                >
                  {story.data.caption}
                </Markdown>
              </Box>
            )}

            <Box
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              my="l"
            >
              <Icon name="chevron-up" size={24} color="white" />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "Bold",
                  color: "white",
                }}
              >
                Swipe up to browse
              </Text>
            </Box>
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
}));
