import { observer } from "mobx-react";
import React, { useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { HomeStackProps } from "..";
import { Box, HeaderBar, SafeArea, Text } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { CartStore, CouponEditor } from "../../state/store/CartStore";
import LocationBar from "../LocationBar";

import ApplyCouponModal from "./ApplyCouponModal";
import Breakdown from "./Breakdown";
import { CheckoutButton } from "./Button";
import CartItems from "./CartItems";
import InvalidCouponModal from "./InvalidCouponModal";
import UpsellItems from "./UpsellItems";
import Voucher from "./Voucher";

const Cart = observer(({ navigation }: HomeStackProps<"Cart">) => {
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get("window").width;

  const cart: CartStore = useAppState("cart");
  const editor: CouponEditor = cart.couponEditor;
  const shouldShowErrorPopup = !editor.isValid;

  const [applyCouponModalVisible, setApplyCouponModalVisible] = useState(false);

  const [applyButtonTapped, setApplyButtonTapped] = useState(false);

  return (
    <SafeArea>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 + insets.bottom }}
      >
        <HeaderBar title="Cart" />
        <LocationBar editMode onEditPress={() => null} />

        <CartItems />
        <UpsellItems />

        {/*Order Summary & Voucher*/}
        <Box style={{ marginTop: 83, paddingHorizontal: 40 }}>
          <Breakdown />
          <Voucher {...{ setApplyCouponModalVisible }} />
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
    </SafeArea>
  );
});

export default Cart;
