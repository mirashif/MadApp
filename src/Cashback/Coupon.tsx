import React from "react";

import { Box, Button, Text, useTheme } from "../components";

interface CouponProps {
  name: string;
  minimum: number;
  points: number;
  disabled?: boolean;
  onPress: () => void;
}

const Coupon = ({
  name,
  minimum,
  points,
  onPress,
  ...otherProps
}: CouponProps) => {
  const theme = useTheme();

  return (
    <Box style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Box>
        <Text
          style={{
            fontFamily: "Bold",
            fontSize: 16,
            color: theme.colors.primary,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontFamily: "Normal",
            fontSize: 14,
            color: theme.colors.darkGray,
          }}
        >
          Minimum Order ৳{minimum}
        </Text>
        <Text
          style={{
            fontFamily: "Normal",
            fontSize: 11,
            color: theme.colors.darkGray,
          }}
        >
          {points} POINTS REQUIRED
        </Text>
      </Box>
      <Button onPress={onPress} size="sm" {...otherProps}>
        Redeem
      </Button>
    </Box>
  );
};

export default Coupon;
