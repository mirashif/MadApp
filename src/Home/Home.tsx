import React from "react";
import { Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box, Button, makeStyles, Text, Theme, useTheme } from "../components";

import LocationBar from "./LocationBar";
import Menu from "./Restaurant/Menu";

const verticalBanners = [...Array(6)].map((_, id) => {
  return { id, imageUri: "https://picsum.photos/200/300" };
});

const restaurantItems = [...Array(6)].map((_, id) => {
  return {
    id,
    imageUri: "https://picsum.photos/200/200",
    discount: "20% OFF",
    name: "Madame Lucy",
    price: "৳ 369.00",
    previousPrice: "৳ 468.00",
  };
});

export default function Home() {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box mb="l" mx="screen">
          <LocationBar
            address="5 Rd No. 2/3, Dhaka 1213"
            label="Scratchboard"
          />
        </Box>

        <Box mb="l" mx="screen" style={styles.wideBanner}>
          <Image
            source={{
              uri: "https://picsum.photos/600/300",
            }}
            style={styles.wideBannerImage}
          />
        </Box>

        <Box mb="xl">
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.screen,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {verticalBanners.map(({ id, imageUri }) => (
              <Box key={id} style={styles.verticalBanner}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.verticalBannerImage}
                />
              </Box>
            ))}
          </ScrollView>
        </Box>

        <Text mb="l" mx="screen" variant="sectionTitle">
          🍴 Restaurants
        </Text>
        <Button>Hellow World!</Button>
        <Button disabled>Hellow World!</Button>
        <Button variant="secondary">Hellow World!</Button>
        <Button variant="secondary" disabled>
          Hellow World!
        </Button>
        <Menu items={restaurantItems} logoUri="https://picsum.photos/40/65" />
        <Menu items={restaurantItems} logoUri="https://picsum.photos/40/65" />
        <Menu items={restaurantItems} logoUri="https://picsum.photos/40/65" />
      </ScrollView>
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
  restaurantItem: {
    marginRight: theme.spacing.xl,
  },
  logo: {
    marginRight: theme.spacing.l,
    justifyContent: "center",
    alignItems: "center",
  },
  logoStyle: {
    width: 38,
    height: 65,
    resizeMode: "contain",
    marginBottom: theme.spacing.s,
  },
}));
