import type { NavigationProp, RouteProp } from "@react-navigation/native";
import React from "react";
import { Image, ImageBackground, TouchableWithoutFeedback } from "react-native";

import type { HomeStackParamList } from "..";
import type { Theme } from "../../components";
import { SafeArea, Icon, Box, makeStyles, Text } from "../../components";
import type { StoryType } from "../../state/store/StoryStore";

interface IStory {
  route: RouteProp<{ params: { story: StoryType } }, "params">;
  navigation: NavigationProp<HomeStackParamList, "Story">;
}

const Story = ({ route, navigation }: IStory) => {
  const styles = useStyles();

  const { story } = route.params;

  return (
    <SafeArea>
      <Box style={styles.container}>
        <ImageBackground
          source={{ uri: story.imageURI }}
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
              source={{ uri: story.thumbnailImageURI }}
              style={styles.avatar}
            />

            <Box px="l" flexDirection="column" alignItems="flex-start">
              <Text
                style={{ fontSize: 15, fontFamily: "Bold", color: "white" }}
              >
                Madchef
              </Text>
              <Text
                style={{ fontSize: 11, fontFamily: "Normal", color: "white" }}
              >
                30 mins
              </Text>
            </Box>
          </Box>

          <Box
            flex={1}
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Bold",
                color: "white",
                marginHorizontal: 70,
                marginBottom: 30,
              }}
            >
              OMG, Madchef is alwayssss there for me!!!! #Madchef #MyLove
            </Text>

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
          </Box>
        </ImageBackground>
      </Box>
    </SafeArea>
  );
};

export default Story;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: 1,
  },
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
