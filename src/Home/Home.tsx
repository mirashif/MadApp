import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import type { Theme } from "../components";
import {
  Box,
  Button,
  CircularIcon,
  Icon,
  makeStyles,
  SafeArea,
  Text,
  useTheme,
} from "../components";
import { useAuth } from "../state/hooks/useAuth";
import { useCart } from "../state/hooks/useCart";
import { useAppState } from "../state/StateContext";
import type { AddressStore } from "../state/store/AddressStore";
import type { BannerStore } from "../state/store/BannerStore";
import type {
  Restaurant,
  RestaurantStore,
} from "../state/store/RestaurantStore";
import type { StoryStore } from "../state/store/StoryStore";

import AddonsItem from "./AddonsItem";
import AuthSheet from "./AuthSheet";
import FloatingCart from "./FloatingCart";
import HomeRestaurant from "./HomeRestaurant";
import LocationBar from "./LocationBar";
import VariationItem from "./VariationItem";

const FOOTER_SHEET_HEIGHT = 144;

export interface IItem {
  id: number | string;
  discount?: string;
  name: string;
  previousPrice?: string;
  price: string;
  imageUri: string;
}

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

const Home = observer(() => {
  const styles = useStyles();
  const theme = useTheme();

  const isFocused = useIsFocused();

  const itemSheetRef = useRef<BottomSheetModal>(null);
  const itemFooterSheetRef = useRef<BottomSheetModal>(null);

  const { authenticated } = useAuth();
  const { length: cartItemCount } = useCart();

  const stories: StoryStore = useAppState("stories");
  const banners: BannerStore = useAppState("banners");
  const restaurants: RestaurantStore = useAppState("restaurants");
  const restaurantList: Restaurant[] = restaurants.all;

  const addresses: AddressStore = useAppState("addresses");

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

  useEffect(() => {
    addresses.setLocation(23.7937, 90.4066);
  }, [addresses]);

  return (
    <SafeArea>
      {cartItemCount > 0 && <FloatingCart />}

      {isFocused && !authenticated && <AuthSheet />}

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

        {banners.all.length > 0 && (
          <Box mb="l" mx="screen" style={styles.wideBanner}>
            <Image
              source={{
                uri: banners.all[0].data.imageURI,
              }}
              style={styles.wideBannerImage}
            />
          </Box>
        )}

        <Box mb="xl">
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.screen,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {stories.all.map(({ data }) => (
              <Box key={data.id} style={styles.verticalBanner}>
                <Image
                  source={{ uri: data.imageURI }}
                  style={styles.verticalBannerImage}
                />
              </Box>
            ))}
          </ScrollView>
        </Box>

        <Text mb="l" mx="screen" variant="sectionTitle">
          🍴 Restaurants
        </Text>

        {restaurantList.map((restaurant) => (
          <HomeRestaurant
            key={restaurant.id}
            restaurant={restaurant.data}
            onItemPress={handleItemPress}
            items={restaurant.popularItems}
          />
        ))}
      </ScrollView>
    </SafeArea>
  );
});

export default Home;

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
