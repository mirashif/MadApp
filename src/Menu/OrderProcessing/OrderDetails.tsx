import React from "react";
import { Dimensions } from "react-native";

import { Box, makeStyles, Text, Theme } from "../../components";

interface OrderDetailsProps {
  orderNumber: string;
  restaurant: string;
  deliveryAddress: string;
}

const OrderDetails = ({
  orderNumber,
  restaurant,
  deliveryAddress,
}: OrderDetailsProps) => {
  const styles = useStyles();
  const windowWidth = Dimensions.get("window").width;

  return (
    <Box
      borderColor="lightGray"
      borderRadius="l"
      borderWidth={1}
      style={{
        paddingTop: 21,
        paddingBottom: 19,
        paddingHorizontal: 32,
        position: "absolute",
        bottom: 0,
        width: windowWidth,
      }}
    >
      <Text fontSize={18}>Order Details</Text>

      <Box flexDirection="row" justifyContent="space-between" mt="m">
        <Box>
          <Text style={styles.orderInfo}>Your order number:</Text>
          <Text style={styles.orderInfo}>Your order from:</Text>
          <Text style={styles.orderInfo}>Delivery Address:</Text>
        </Box>

        <Box alignItems="flex-end">
          <Box style={[styles.orderNumber, styles.orderInfo]}>
            <Text color="primary" px="m">
              {orderNumber}
            </Text>
          </Box>
          <Text style={styles.orderInfo}>{restaurant}</Text>
          <Text style={styles.orderInfo}>{deliveryAddress}</Text>
        </Box>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  orderInfo: {
    marginBottom: 5,
  },
  orderNumber: {
    color: theme.colors.primary,
    backgroundColor: "#FBF4F6",
    borderRadius: 20,
    alignItems: "center",
  },
}));

export default OrderDetails;
