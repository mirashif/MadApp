import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { ScrollView, Image, TouchableWithoutFeedback } from "react-native";

import type { Theme } from "../components";
import { Box, makeStyles, useTheme } from "../components";
import type { RootStackProps } from "../components/AppNavigator";
import { useAppState } from "../state/StateContext";
import type { Story, StoryStore } from "../state/store/StoryStore";

const Stories = observer(() => {
  const styles = useStyles();
  const theme = useTheme();
  const navigation = useNavigation<RootStackProps<"HomeStack">["navigation"]>();

  const stories: StoryStore = useAppState("stories");
  const storyList: Story[] = stories.all;

  return (
    <Box mb="xl">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {storyList.map((story) => (
          <TouchableWithoutFeedback
            key={story.data.id}
            onPress={() =>
              navigation.navigate("HomeStack", {
                screen: "Story",
                params: { id: story.data.id },
              })
            }
          >
            <Box style={styles.story}>
              <Image
                source={{ uri: story.data.thumbnailImageURI }}
                style={styles.storyImage}
              />
            </Box>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </Box>
  );
});

export default Stories;

const useStyles = makeStyles((theme: Theme) => ({
  story: {
    height: 158,
    width: 84,
    marginRight: theme.spacing.l,
    borderRadius: theme.borderRadii.l,
    overflow: "hidden",
  },
  storyImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: theme.colors.gray,
  },
}));
