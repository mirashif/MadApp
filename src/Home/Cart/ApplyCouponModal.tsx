import React from "react";

import { Box, CustomModal, Input } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { CartStore, CouponEditor } from "../../state/store/CartStore";

import VoucherIllustration from "./assets/VoucherIllustration.svg";

interface ApplyCouponModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyPress: () => void;
}

const ApplyCouponModal = ({
  visible,
  onClose,
  onApplyPress,
}: ApplyCouponModalProps) => {
  const cart: CartStore = useAppState("cart");
  const editor: CouponEditor = cart.couponEditor;

  const handleApply = async () => {
    await editor.applyCoupon();
    onApplyPress();
    onClose();
  };

  return (
    <CustomModal
      visible={visible}
      onRequestClose={onClose}
      buttonTitle="Apply"
      onButtonPress={handleApply}
      buttonDisabled={!editor.couponExists}
      onBackPress={onClose}
    >
      <>
        <Box alignItems="center">
          <VoucherIllustration />
        </Box>

        <Box my="m">
          <Input
            placeholder="Enter Your Voucher Code"
            onChangeText={editor.setCode}
          />
        </Box>
      </>
    </CustomModal>
  );
};

export default ApplyCouponModal;
