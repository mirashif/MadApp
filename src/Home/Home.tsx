import React, { useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

import type { Theme } from "../components";
import {
  Icon,
  Box,
  Button,
  CircularIcon,
  makeStyles,
  SafeArea,
  Text,
  useTheme,
} from "../components";

import LocationBar from "./LocationBar";
import HomeRestaurant from "./HomeRestaurant";
import VariationItem from "./VariationItem";
import AddonsItem from "./AddonsItem";
import FloatingCart from "./FloatingCart";

const FOOTER_SHEET_HEIGHT = 144;

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

const variations = [
  {
    id: 1,
    name: "12 “",
    price: 699,
  },
  {
    id: 2,
    name: "16 “",
    price: 1119,
  },
];

export default function Home() {
  const styles = useStyles();
  const theme = useTheme();

  const itemSheetRef = useRef<BottomSheetModal>(null);
  const itemFooterSheetRef = useRef<BottomSheetModal>(null);

  const [selectedVariationID, setSelectedVariationID] = useState<
    null | string | number
  >(null);

  const handleItemPress = () => {
    itemSheetRef.current?.present();
  };

  const handleItemSheetChange = (index: number) => {
    if (index > -1) itemFooterSheetRef.current?.present();
  };

  const handleDismiss = () => {
    itemSheetRef.current?.close();
    itemFooterSheetRef.current?.close();
  };

  return (
    <SafeArea>
      <FloatingCart />
      {/* ItemSheet */}
      <BottomSheetModal
        ref={itemSheetRef}
        snapPoints={["60%", "90%"]}
        handleComponent={null}
        onDismiss={handleDismiss}
        onChange={handleItemSheetChange}
        backdropComponent={BottomSheetBackdrop}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: FOOTER_SHEET_HEIGHT }}
        >
          {/* Header */}
          <ImageBackground
            style={{
              height: 272,
            }}
            imageStyle={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            source={{ uri: "https://source.unsplash.com/a66sGfOnnqQ/" }}
          >
            {/* CLOSE ICON */}
            <TouchableWithoutFeedback onPress={handleDismiss}>
              <View
                style={{
                  position: "absolute",
                  top: 13,
                  left: 13,
                }}
              >
                <Icon name="x" size={24} color="white" />
              </View>
            </TouchableWithoutFeedback>

            {/* Handle Bar */}
            <View
              style={{
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  width: 100,
                  height: 2,
                  position: "absolute",
                  top: 13,
                }}
              />
            </View>
          </ImageBackground>

          {/* Main Scrollable */}
          <View
            style={{
              marginVertical: 25,
              marginHorizontal: 30,
            }}
          >
            <Text
              style={{
                fontFamily: "Normal",
                fontSize: 28,
                color: "black",
                marginBottom: 16,
              }}
            >
              Chicken Alfredo
            </Text>
            <Text
              style={{
                fontFamily: "Normal",
                fontSize: 14,
                color: "#8A8A8A",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis
              condimentum faucibus viverra non nullam nisl bibendum egestas.
            </Text>

            <View style={{ marginTop: 24 }}>
              <Text style={styles.modalSectionTitle}>Variation</Text>
              <Text style={styles.modalSectionSubtitle}>Select one</Text>

              <Box>
                {variations.map((variation) => (
                  <VariationItem
                    key={variation.id}
                    name={variation.name}
                    price={variation.price}
                    selected={variation.id === selectedVariationID}
                    onPress={() => setSelectedVariationID(variation.id)}
                  />
                ))}
              </Box>
            </View>

            <View style={{ marginTop: 14 }}>
              <Text style={styles.modalSectionTitle}>Add-ons</Text>
              <Text style={styles.modalSectionSubtitle}>Select one</Text>

              <Box>
                <AddonsItem />
                <AddonsItem />
              </Box>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* Footer */}
      <BottomSheetModal
        ref={itemFooterSheetRef}
        snapPoints={[FOOTER_SHEET_HEIGHT]}
        handleComponent={null}
        stackBehavior="push"
      >
        <View
          style={{
            height: FOOTER_SHEET_HEIGHT,
            paddingTop: 20,
            paddingBottom: 28,
          }}
        >
          <View
            style={{
              marginHorizontal: 30,
            }}
          >
            <Text
              style={{
                fontFamily: "Normal",
                fontSize: 28,
                color: "black",
              }}
            >
              ৳699.00
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 30,
            }}
          >
            <CircularIcon
              color="#8A8A8A"
              backgroundColor="#F8F8F8"
              name="minus"
              size={40}
            />
            <View
              style={{
                width: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Normal",
                  fontSize: 17,
                  color: "#8A8A8A",
                }}
              >
                1
              </Text>
            </View>
            <CircularIcon name="plus" size={40} />

            <Button size="xl" onPress={() => console.log("ADD TO CART")}>
              ADD TO CART
            </Button>
          </View>
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
  modalSectionTitle: {
    fontSize: 20,
    marginBottom: 5,
  },
  modalSectionSubtitle: {
    color: "#8A8A8A",
  },
}));
