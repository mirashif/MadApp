import { observer } from "mobx-react";
import React, { useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { HomeStackProps } from "..";
import {
  Box,
  HeaderBar,
  makeStyles,
  SafeArea,
  Text,
  useTheme,
} from "../../components";
import { useAppState } from "../../state/StateContext";
import type {
  CartableWrapper,
  CartStore,
  CouponEditor,
} from "../../state/store/CartStore";
import type { Item } from "../../state/store/ItemStore";
import { ItemBuilder } from "../ItemBuilder";
import LocationBar from "../LocationBar";

import ApplyCouponModal from "./ApplyCouponModal";
import Breakdown from "./Breakdown";
import { CheckoutButton, ClearCartButton, VoucherButton } from "./Button";
import Discount from "./Discount";
import InvalidCouponModal from "./InvalidCouponModal";
import OrderItem from "./OrderItem";
import UpsellItem from "./UpsellItem";

const Cart = observer(({ navigation }: HomeStackProps<"Cart">) => {
  const theme = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get("window").width;

  const cart: CartStore = useAppState("cart");
  const cartItems: CartableWrapper[] = cart.all;
  const upsellItems: Item[] = cart.upsellItems;
  const isCouponAdded = !!cart.couponDeal;
  const editor: CouponEditor = cart.couponEditor;
  const shouldShowErrorPopup = !editor.isValid;

  const [applyCouponModalVisible, setApplyCouponModalVisible] = useState(false);
  const [itemBuilderId, setItemBuilderId] = useState<string | null>(null);
  const [applyButtonTapped, setApplyButtonTapped] = useState(false);

  return (
    <SafeArea>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 + insets.bottom }}
      >
        <HeaderBar title="Cart" />

        <LocationBar editMode onEditPress={() => null} />

        {/*Order Items*/}
        <Box px={"screen"}>
          <Box style={{ marginTop: 33 }}>
            <Text style={styles.sectionTitle}>Order Details</Text>

            {cartItems.map((item) => (
              <OrderItem
                key={item.itemID}
                {...{ item }}
                onIncrease={item.increment}
                onDecrease={item.decrement}
                onDelete={item.remove}
              />
            ))}

            <Box mt="s">
              <ClearCartButton onPress={cart.clearCart} />
            </Box>
          </Box>
        </Box>

        {/*Popular Orders*/}
        <Box style={{ marginTop: 40 }}>
          <Box px="screen">
            <Text style={styles.sectionTitle}>Popular with your order</Text>
          </Box>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.screen,
            }}
          >
            {upsellItems.map((item) => (
              <UpsellItem
                key={item.id}
                {...{ item }}
                onAdd={setItemBuilderId}
              />
            ))}
          </ScrollView>
        </Box>

        {/*Order Summary & Voucher*/}
        <Box style={{ marginTop: 83, paddingHorizontal: 40 }}>
          <Breakdown />

          <Box mt="m">
            {isCouponAdded ? (
              <Discount
                amount={cart.discountAmount}
                onDiscountCancel={cart.clearCoupon}
              />
            ) : (
              <VoucherButton onPress={() => setApplyCouponModalVisible(true)} />
            )}
          </Box>
        </Box>
      </ScrollView>

      {/*Total & Checkout*/}
      <Box
        position="absolute"
        bottom={0}
        width={windowWidth}
        backgroundColor="background"
        style={{ paddingTop: 22, paddingBottom: 16 + insets.bottom }}
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ paddingHorizontal: 40 }}
        >
          <Box>
            <Text style={{ fontSize: 18 }}>Total</Text>
            <Text style={{ color: "#BBBBBB", fontSize: 11 }}>VAT included</Text>
          </Box>

          <Text style={{ fontSize: 18 }}>৳{cart.grandTotalAmount}</Text>
        </Box>

        <Box style={{ alignItems: "center", marginTop: 27 }}>
          <CheckoutButton onPress={() => navigation.navigate("Checkout")} />
        </Box>
      </Box>

      <ApplyCouponModal
        visible={applyCouponModalVisible}
        onClose={() => setApplyCouponModalVisible(false)}
        onApplyPress={() => setApplyButtonTapped(true)}
      />
      <InvalidCouponModal
        visible={applyButtonTapped && shouldShowErrorPopup}
        onRetryPress={() => {
          setApplyButtonTapped(false);
          setApplyCouponModalVisible(true);
        }}
      />

      <ItemBuilder {...{ itemBuilderId, setItemBuilderId }} />
    </SafeArea>
  );
});

const useStyles = makeStyles(() => ({
  sectionTitle: {
    color: "#8A8A8A",
    fontSize: 18,
    marginBottom: 21,
  },
}));

export default Cart;
