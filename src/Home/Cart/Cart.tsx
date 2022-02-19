import { observer } from "mobx-react";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Box, HeaderBar, SafeArea } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { CartStore, CouponEditor } from "../../state/store/CartStore";
import LocationBar from "../LocationBar";

import ApplyCouponModal from "./ApplyCouponModal";
import Breakdown from "./Breakdown";
import CartItems from "./CartItems";
import InvalidCouponModal from "./InvalidCouponModal";
import Total from "./Total";
import UpsellItems from "./UpsellItems";
import Voucher from "./Voucher";

const Cart = observer(() => {
  const insets = useSafeAreaInsets();

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

        {/*Order breakdown & Voucher*/}
        <Box style={{ marginTop: 83, paddingHorizontal: 40 }}>
          <Breakdown />
          <Voucher {...{ setApplyCouponModalVisible }} />
        </Box>
      </ScrollView>

      {/* Grand total & checkout */}
      <Total />

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
