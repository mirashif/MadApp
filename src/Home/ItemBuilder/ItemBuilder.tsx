import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ImageBackground, TouchableWithoutFeedback, View } from "react-native";
import { observer } from "mobx-react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Item, ItemStore } from "../../state/store/ItemStore";
import type { Theme } from "../../components";
import {
  CurrencyFormat,
  Button,
  CircularIcon,
  Icon,
  makeStyles,
  Text,
} from "../../components";
import { useAppState } from "../../state/StateContext";

import Variants from "./Variants";
import Addons from "./Addons";

const FOOTER_HEIGHT = 144;

interface ItemBottomSheetProps {
  itemBuilderId: string | null;
  setItemBuilderId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ItemBuilder = observer(
  ({ itemBuilderId, setItemBuilderId }: ItemBottomSheetProps) => {
    const styles = useStyles();

    const items: ItemStore = useAppState("items");
    const item = items.get(itemBuilderId || "");
    const itemName = item?.data.name;
    const itemDescription = item?.data.description;
    const itemImageURI = item?.data.pictureURI;

    const itemSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["90%"], []);
    const handleDismiss = useCallback(() => {
      itemSheetRef.current?.close();
      setItemBuilderId(null);
    }, [setItemBuilderId]);
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
    const renderFooter = useCallback(
      (props) => (
        <BottomSheetFooter {...props}>
          <ItemFooter {...{ item, handleDismiss }} />
        </BottomSheetFooter>
      ),
      [handleDismiss, item]
    );

    useEffect(() => {
      if (!itemBuilderId || !item) {
        return itemSheetRef.current?.close();
      } else {
        return itemSheetRef.current?.present();
      }
    }, [itemBuilderId, item]);

    return (
      <BottomSheetModal
        ref={itemSheetRef}
        snapPoints={snapPoints}
        handleComponent={null}
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          scrollToOverflowEnabled={true}
        >
          {/* Header */}
          <ImageBackground
            style={styles.headerImageContainer}
            imageStyle={styles.headerImage}
            source={{ uri: itemImageURI }}
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
          <View style={styles.main}>
            <Text style={styles.itemName}>{itemName}</Text>
            <Text style={styles.itemDescription}>{itemDescription}</Text>
            <Variants {...{ item }} />
            <Addons {...{ item }} />
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

export default ItemBuilder;

const ItemFooter = observer(
  ({
    item,
    handleDismiss,
  }: {
    item: Item | null;
    handleDismiss: () => void;
  }) => {
    const styles = useStyles();
    const insets = useSafeAreaInsets();

    const cartable = item?.cartable;
    const count = cartable?.count;
    const price = cartable?.price;
    const originalPrice = cartable?.originalPrice;
    const isDealApplided = cartable?.isDealApplied;
    const variantGroups = cartable?.cartableVariantGroups;

    return (
      <View
        style={[
          styles.footerContainer,
          {
            paddingBottom: insets.bottom + 28,
          },
        ]}
      >
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            <CurrencyFormat value={price} />
          </Text>
          {isDealApplided && (
            <Text style={styles.originalPrice}>
              <CurrencyFormat value={originalPrice} />
            </Text>
          )}
        </View>

        <View style={styles.cartContainer}>
          <TouchableWithoutFeedback onPress={() => cartable?.decrement()}>
            <CircularIcon
              color="#8A8A8A"
              backgroundColor="#F8F8F8"
              name="minus"
              size={40}
            />
          </TouchableWithoutFeedback>
          <View style={styles.cartCountContainer}>
            <Text style={styles.cartCount}>{count}</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => cartable?.increment()}>
            <CircularIcon name="plus" size={40} />
          </TouchableWithoutFeedback>

          <Button
            size="xl"
            disabled={!variantGroups?.every((group) => group.selected)}
            onPress={() => {
              cartable?.addToCart();
              handleDismiss();
            }}
          >
            ADD TO CART
          </Button>
        </View>
      </View>
    );
  }
);

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
  main: {
    marginVertical: 25,
    marginHorizontal: 30,
    paddingBottom: FOOTER_HEIGHT,
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
  // Footer Sheet
  footerContainer: {
    height: FOOTER_HEIGHT,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  priceContainer: {
    marginHorizontal: 30,
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontFamily: "Normal",
    fontSize: 28,
    color: "black",
  },
  originalPrice: {
    fontFamily: "Normal",
    fontSize: 14,
    color: "#bebebe",
    marginLeft: 10,
    textDecorationLine: "line-through",
  },
  cartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 30,
  },
  cartCountContainer: {
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  cartCount: {
    fontFamily: "Normal",
    fontSize: 17,
    color: "#8A8A8A",
  },
}));
