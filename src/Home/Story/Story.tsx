import React from "react";
import { ImageBackground } from "react-native";

import type { Theme } from "../../components";
import { Box, makeStyles, Text } from "../../components";

const image = { uri: "https://reactjs.org/logo-og.png" };

const Story = () => {
  const styles = useStyles();

  return (
    <Box style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.text}>Inside</Text>
      </ImageBackground>
    </Box>
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
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: theme.colors.primary,
  },
}));
