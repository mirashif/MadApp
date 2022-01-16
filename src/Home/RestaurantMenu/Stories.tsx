import React from "react";
import { ScrollView, Image } from "react-native";

import type { Theme } from "../../components";
import { Box, makeStyles, useTheme } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { Story, StoryStore } from "../../state/store/StoryStore";

const Stories = () => {
  const styles = useStyles();
  const theme = useTheme();

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
        {storyList.map(({ data: { id, imageURI } }) => (
          <Box key={id} style={styles.story}>
            <Image source={{ uri: imageURI }} style={styles.storyImage} />
          </Box>
        ))}
      </ScrollView>
    </Box>
  );
};

export default Stories;

const useStyles = makeStyles((theme: Theme) => ({
  story: {
    height: 158,
    width: 84,
    marginRight: theme.spacing.m,
    borderRadius: theme.borderRadii.l,
    overflow: "hidden",
  },
  storyImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
}));
