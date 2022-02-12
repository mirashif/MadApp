import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ImageBackground, TouchableWithoutFeedback, View } from "react-native";
import { observer } from "mobx-react";

import type { ItemStore } from "../../state/store/ItemStore";
import type { Theme } from "../../components";
import {
  Box,
  Button,
  CircularIcon,
  Icon,
  makeStyles,
  Text,
} from "../../components";
import { useAppState } from "../../state/StateContext";

import AddonsItem from "./AddonsItem";
import VariantGroups from "./VariantGroups";

const FOOTER_SHEET_HEIGHT = 144;

interface ItemBottomSheetProps {
  bottomSheetItemId: string | null;
  setBottomSheetItemId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ItemBottomSheet = observer(
  ({ bottomSheetItemId, setBottomSheetItemId }: ItemBottomSheetProps) => {
    const styles = useStyles();

    const items: ItemStore = useAppState("items");
    const item = useMemo(() => {
      return bottomSheetItemId ? items.get(bottomSheetItemId) : null;
    }, [bottomSheetItemId, items]);

    const itemSheetRef = useRef<BottomSheetModal>(null);
    const itemFooterSheetRef = useRef<BottomSheetModal>(null);

    const handleItemSheetChange = (index: number) => {
      if (index > -1) itemFooterSheetRef.current?.present();
    };

    const handleDismiss = useCallback(() => {
      itemSheetRef.current?.close();
      itemFooterSheetRef.current?.close();
      setBottomSheetItemId(null);
    }, [setBottomSheetItemId]);

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
      if (!item) return;
      itemSheetRef.current?.present();

      return () => {
        handleDismiss();
      };
    }, [handleDismiss, item]);

    if (!item) return null;
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
              style={styles.headerImageContainer}
              imageStyle={styles.headerImage}
              source={{ uri: item.data.pictureURI }}
            >
              {/* CLOSE ICON */}
              <TouchableWithoutFeedback onPress={handleDismiss}>
                <View style={styles.closeIcon}>
                  <Icon name="x" size={24} color="white" />
                </View>
              </TouchableWithoutFeedback>

              {/* Handle Bar */}
              <View style={styles.handleBarContainer}>
                <View style={styles.handleBar} />
              </View>
            </ImageBackground>

            {/* Main Scrollable */}
            <View style={styles.mainScrollableContainer}>
              <Text style={styles.itemName}>{item.data.name}</Text>
              <Text style={styles.itemDescription}>
                {item.data.description}
              </Text>

              <VariantGroups {...{ item }} />

              {item.addons.length > 0 && (
                <View style={{ marginTop: 14 }}>
                  <Text variant="modalSectionTitle">Add-ons</Text>
                  <Text variant="modalSectionSubtitle">Select one</Text>

                  <Box>
                    {item.addons.map((addon) => (
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
                ৳ {item.data.price}
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
                  {/* TODO: Add cart */}1
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
  }
);

export default ItemBottomSheet;

const useStyles = makeStyles((theme: Theme) => ({
  headerImageContainer: {
    height: 272,
  },
  headerImage: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: theme.colors.gray,
  },
  closeIcon: {
    position: "absolute",
    top: 13,
    left: 13,
  },
  handleBarContainer: {
    alignItems: "center",
  },
  handleBar: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    width: 100,
    height: 2,
    position: "absolute",
    top: 13,
  },
  mainScrollableContainer: {
    marginVertical: 25,
    marginHorizontal: 30,
  },
  itemName: {
    fontFamily: "Normal",
    fontSize: 28,
    color: "black",
    marginBottom: 16,
  },
  itemDescription: {
    fontFamily: "Normal",
    fontSize: 14,
    color: "#8A8A8A",
    marginBottom: 24,
  },
}));
