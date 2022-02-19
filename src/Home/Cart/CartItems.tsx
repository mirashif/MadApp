import { observer } from "mobx-react";
import React from "react";

import { Box, Text } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { CartableWrapper, CartStore } from "../../state/store/CartStore";

import { ClearCartButton } from "./Button";
import CartItem from "./CartItem";

const CartItems = observer(() => {
  const cart: CartStore = useAppState("cart");
  const cartItems: CartableWrapper[] = cart.all;

  return (
    <Box px={"screen"}>
      <Box style={{ marginTop: 33 }}>
        <Text style={{ color: "#8A8A8A", fontSize: 18, marginBottom: 21 }}>
          Order Details
        </Text>

        {cartItems.map((item) => (
          <CartItem
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
  );
});

export default CartItems;
