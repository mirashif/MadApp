import React from "react";
import { Box, CurrencyFormat, Text } from "../../../components";

export const OrderSummaryItem = ({
  title, description, color,
}: {
  title: string;
  description: string;
  color?: string;
}) => (
  <Box
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    style={{ marginBottom: 6 }}
  >
    <Text style={{ color: color || "#111111" }}>{title}</Text>
    <Text style={{ color: color || "#8A8A8A" }}>
      <CurrencyFormat value={description} />
    </Text>
  </Box>
);
