import React from "react";

import { Box, Text } from "../../components";

interface OrderSummaryItemProps {
  title: string;
  description: string;
}

const OrderSummaryItem = ({ title, description }: OrderSummaryItemProps) => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ marginBottom: 6 }}
    >
      <Text style={{ color: "#111111" }}>{title}</Text>
      <Text style={{ color: "#8A8A8A" }}>{description}</Text>
    </Box>
  );
};

export default OrderSummaryItem;
