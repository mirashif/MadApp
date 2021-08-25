import React from "react";
import type { ViewStyle } from "react-native";

import { Box } from "./theme";

interface OrderStageBarProps {
  stage: 1 | 2 | 3;
  style?: ViewStyle;
}

const Step = ({ active }: { active?: boolean }) => (
  <Box
    borderRadius="xl"
    style={{
      width: active ? 188 : 14,
      height: 8,
      backgroundColor: active ? "#FF385A" : "#CBCBCB",
    }}
  />
);

const OrderStageBar = ({ stage, style }: OrderStageBarProps) => {
  return (
    <Box
      {...{ style }}
      width={238}
      justifyContent="space-between"
      flexDirection="row"
    >
      <Step active={stage === 1} />
      <Step active={stage === 2} />
      <Step active={stage === 3} />
    </Box>
  );
};

export default OrderStageBar;
