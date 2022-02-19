import React from "react";

import { useAppState } from "../state/StateContext";
import type { CartStore } from "../state/store/CartStore";

import { Box } from "./theme";

interface FloatingAreaSpaceProps {
  height?: number;
}

const FloatingAreaSpace = ({ height = 80 }: FloatingAreaSpaceProps) => {
  const cart: CartStore = useAppState("cart");

  if (cart.all.length === 0) return null;

  return <Box height={height} />;
};

export default FloatingAreaSpace;
