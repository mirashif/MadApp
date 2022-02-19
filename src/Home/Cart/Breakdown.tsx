import { observer } from "mobx-react";
import React from "react";

import { Box, Text } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { CartStore } from "../../state/store/CartStore";

const Item = ({
  title,
  description,
}: {
  title: string;
  description: string | number;
}) => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ marginBottom: 6 }}
    >
      <Text style={{ color: "#111111" }}>{title}</Text>
      <Text style={{ color: "#8A8A8A" }}>৳{description}</Text>
    </Box>
  );
};

const Breakdown = observer(() => {
  const cart: CartStore = useAppState("cart");

  return (
    <>
      <Item title="Subtotal" description={cart.subtotalAmount} />
      <Item title="SD" description={cart.serviceChargeAmount} />
      <Item title="VAT" description={cart.vatAmount} />
      <Item title="Delivery fee" description={cart.deliveryChargeAmount} />
    </>
  );
});

export default Breakdown;
