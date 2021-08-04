import React from "react";

import { Box, Icon, Text, useTheme } from "../../components";

interface ItemProps {
  restaurant: string;
  price: number;
  date: string;
  status: string;
}

const Item = ({ restaurant, price, date, status }: ItemProps) => {
  const theme = useTheme();

  let statusColor;

  switch (status.toLocaleLowerCase()) {
    case "active":
      statusColor = theme.colors.primary;
      break;

    case "delivered":
      statusColor = "#1CC66A";
      break;

    case "cancelled":
      statusColor = "#FF9F2F";
      break;

    default:
      statusColor = "#000";
      break;
  }

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      borderColor="lightGray"
      borderWidth={1}
      px="l"
      borderRadius="l"
      style={{ paddingVertical: 8, marginBottom: 6 }}
    >
      <Box>
        <Text>
          {restaurant} - ৳{price}
        </Text>
        <Text fontSize={12} style={{ marginTop: 3 }}>
          {date}
        </Text>
      </Box>

      <Box flexDirection="row" alignItems="center">
        <Box
          style={{
            width: 70,
            height: 22,
            borderColor: statusColor,
            borderWidth: 2,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: statusColor, fontSize: 12 }}>{status}</Text>
        </Box>

        <Icon name="chevron-right" size={30} color="#CBCBCB" />
      </Box>
    </Box>
  );
};

export default Item;
