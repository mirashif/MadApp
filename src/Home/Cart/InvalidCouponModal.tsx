import { observer } from "mobx-react";
import React from "react";

import { CustomModal, Text } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { CartStore, CouponEditor } from "../../state/store/CartStore";

interface InvalidCouponModalProps {
  visible: boolean;
  onRetryPress: () => void;
}

const InvalidCouponModal = observer(
  ({ visible, onRetryPress }: InvalidCouponModalProps) => {
    const cart: CartStore = useAppState("cart");
    const editor: CouponEditor = cart.couponEditor;

    return (
      <CustomModal
        visible={visible}
        onRequestClose={onRetryPress}
        onBackPress={onRetryPress}
        buttonTitle="Try Again"
        onButtonPress={onRetryPress}
        title="Uh Oh!"
      >
        <Text fontSize={15} style={{ marginTop: 29, marginBottom: 35 }}>
          {editor.invalidityReason}
        </Text>
      </CustomModal>
    );
  }
);

export default InvalidCouponModal;
