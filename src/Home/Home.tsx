import React from "react";
import { ImageBackground, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box, makeStyles, Text, Theme } from "../components";

import LocationBar from "./LocationBar";
import Item from "./Restaurant/Item";

const items = [...Array(6).keys()];

export default function Home() {
  const styles = useStyles();

  return (
    <SafeAreaView>
      <Box mb="l" mx="screen">
        <LocationBar />
      </Box>

      <Box mb="l" mx="screen" style={styles.wideBanner}>
        <ImageBackground
          source={require("./assets/wide-banner.png")}
          style={styles.wideBannerImage}
        />
      </Box>

      <Box mb="xl" ml="screen">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((_, i) => (
            <Box key={i} style={styles.verticalBanner}>
              <ImageBackground
                source={require("./assets/wide-banner.png")}
                style={styles.verticalBannerImage}
              />
            </Box>
          ))}
        </ScrollView>
      </Box>

      <Box mx="screen">
        <Text mb="l" variant="sectionTitle">
          🍴 Restaurants
        </Text>
        <Item
          discount="20% OFF"
          name="Madame Lucy"
          price="$ 369.00"
          previousPrice="$ 468.00"
        />
      </Box>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  wideBanner: {
    height: 130,
    borderRadius: theme.borderRadii.l,
    overflow: "hidden",
  },
  wideBannerImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  verticalBanner: {
    height: 158,
    width: 84,
    marginRight: theme.spacing.m,
    borderRadius: theme.borderRadii.l,
    overflow: "hidden",
  },
  verticalBannerImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
}));
