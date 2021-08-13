import React, { useCallback, useMemo, useRef } from "react";
import { Image, ScrollView, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import {
  Box,
  makeStyles,
  SafeArea,
  Text,
  Theme,
  useTheme,
} from "../components";

import LocationBar from "./LocationBar";
import HomeRestaurant from "./HomeRestaurant";

const verticalBanners = [...Array(6)].map((_, id) => {
  return { id, imageUri: "https://picsum.photos/200/300" };
});

export interface IItem {
  id: number | string;
  discount?: string;
  name: string;
  previousPrice?: string;
  price: string;
  imageUri: string;
}

const restaurantItems = [...Array(6)].map((_, id) => {
  return {
    id,
    imageUri: "https://source.unsplash.com/a66sGfOnnqQ/200x200",
    discount: "20% OFF",
    name: "Madame Lucy",
    price: "৳ 369.00",
    previousPrice: "৳ 468.00",
  };
});

export default function Home() {
  const styles = useStyles();
  const theme = useTheme();

  const itemSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["70%", "90%"], []);

  const handleItemPress = useCallback(() => {
    itemSheetRef.current?.present();
  }, []);

  const handleItemSheetChanges = useCallback((index: number) => {
    console.log("handleItemSheetChanges", index);
  }, []);

  return (
    <SafeArea>
      <BottomSheetModal
        ref={itemSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleItemSheetChanges}
      >
        <View
          style={{
            flex: 1,
            padding: 24,
            justifyContent: "center",
          }}
        >
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheetModal>

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
        <HomeRestaurant
          onItemPress={handleItemPress}
          items={restaurantItems}
          logoUri="https://picsum.photos/40/65"
        />
        <HomeRestaurant
          onItemPress={handleItemPress}
          items={restaurantItems}
          logoUri="https://picsum.photos/40/65"
        />
        <HomeRestaurant
          onItemPress={handleItemPress}
          items={restaurantItems}
          logoUri="https://picsum.photos/40/65"
        />
      </ScrollView>
    </SafeArea>
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
