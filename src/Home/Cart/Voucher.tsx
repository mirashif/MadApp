import { observer } from "mobx-react";
import React from "react";

import { Box } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { CartStore } from "../../state/store/CartStore";

import { VoucherButton } from "./Button";
import Discount from "./Discount";

interface VoucherProps {
  setApplyCouponModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Voucher = observer(({ setApplyCouponModalVisible }: VoucherProps) => {
  const cart: CartStore = useAppState("cart");
  const isCouponAdded = !!cart.couponDeal;

  return (
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
  );
});

export default Voucher;
