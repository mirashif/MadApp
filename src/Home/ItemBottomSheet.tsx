import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { ImageBackground, TouchableWithoutFeedback, View } from "react-native";

import type { Item } from "../state/store/ItemStore";
import type { Theme } from "../components";
import {
  Box,
  Button,
  CircularIcon,
  Icon,
  makeStyles,
  Text,
  useTheme,
} from "../components";

import AddonsItem from "./AddonsItem";

const FOOTER_SHEET_HEIGHT = 144;

interface ItemBottomSheetProps {
  bottomSheetItem: Item | null;
  setBottomSheetItem: React.Dispatch<React.SetStateAction<Item | null>>;
}

const ItemBottomSheet = ({
  bottomSheetItem,
  setBottomSheetItem,
}: ItemBottomSheetProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const itemSheetRef = useRef<BottomSheetModal>(null);
  const itemFooterSheetRef = useRef<BottomSheetModal>(null);

  const handleItemSheetChange = (index: number) => {
    if (index > -1) itemFooterSheetRef.current?.present();
  };

  const handleDismiss = () => {
    itemSheetRef.current?.close();
    itemFooterSheetRef.current?.close();
    setBottomSheetItem(null);
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  useEffect(() => {
    if (!bottomSheetItem) return;
    itemSheetRef.current?.present();
  }, [bottomSheetItem]);

  if (!bottomSheetItem) return null;
  return (
    <>
      {/* ItemSheet */}
      <BottomSheetModal
        ref={itemSheetRef}
        snapPoints={["60%", "90%"]}
        handleComponent={null}
        onDismiss={handleDismiss}
        onChange={handleItemSheetChange}
        backdropComponent={renderBackdrop}
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
              backgroundColor: theme.colors.gray,
            }}
            source={{ uri: bottomSheetItem?.data.pictureURI }}
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
              {bottomSheetItem?.data.name}
            </Text>
            <Text
              style={{
                fontFamily: "Normal",
                fontSize: 14,
                color: "#8A8A8A",
              }}
            >
              {bottomSheetItem?.data.description}
            </Text>

            <View style={{ marginTop: 24 }}>
              <Text style={styles.modalSectionTitle}>Variation</Text>
              <Text style={styles.modalSectionSubtitle}>Select one</Text>

              <Box>
                {/* {variations.map((variation) => (
                  <VariationItem
                    key={variation.id}
                    name={variation.name}
                    price={variation.price}
                    selected={variation.id === selectedVariationID}
                    onPress={() => setSelectedVariationID(variation.id)}
                  />
                ))} */}
              </Box>
            </View>

            {bottomSheetItem && bottomSheetItem.addons.length > 0 && (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.modalSectionTitle}>Add-ons</Text>
                <Text style={styles.modalSectionSubtitle}>Select one</Text>

                <Box>
                  {bottomSheetItem.addons.map((addon) => (
                    <AddonsItem key={addon.data.id} {...{ addon }} />
                  ))}
                </Box>
              </View>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* ItemFooter */}
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
              ৳{bottomSheetItem?.data.price}
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
    </>
  );
};

export default ItemBottomSheet;

const useStyles = makeStyles((theme: Theme) => ({
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
