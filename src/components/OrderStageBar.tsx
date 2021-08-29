import React from "react";

import { Box } from "./theme";

interface OrderStageBarProps {
  stage: 1 | 2 | 3;
  containerWidth: number;
  activeBarWidth: number;
  inactiveBarWidth: number;
}

const OrderStageBar = ({
  stage,
  containerWidth,
  activeBarWidth,
  inactiveBarWidth,
}: OrderStageBarProps) => {
  const Step = ({ active }: { active?: boolean }) => (
    <Box
      borderRadius="xl"
      style={{
        width: active ? activeBarWidth : inactiveBarWidth,
        height: 8,
        backgroundColor: active ? "#FF385A" : "#CBCBCB",
      }}
    />
  );

  return (
    <Box
      width={containerWidth}
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
