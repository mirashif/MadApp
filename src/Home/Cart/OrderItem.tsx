import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";

import { Box, Icon, Text, useTheme } from "../../components";

import QuantityButton from "./QuantityButton";

interface OrderItemProps {
  id: string;
  name: string;
  addons: string;
  price: number;
  image: string;
  quantity: number;
  onDelete: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}

const OrderItem = (props: OrderItemProps) => {
  const theme = useTheme();
  const {
    id,
    name,
    addons,
    price,
    image,
    quantity,
    onDelete,
    onIncrease,
    onDecrease,
  } = props;

  return (
    <Box flexDirection="row" alignItems="center" marginBottom="l">
      <Box position="relative">
        <Image
          source={{
            uri: image,
          }}
          style={{ width: 114, height: 114, borderRadius: 12 }}
        />

        <Box position="absolute" bottom={-3} right={-8}>
          <TouchableWithoutFeedback onPress={() => onDelete(id)}>
            <Box
              style={{
                height: 34,
                width: 34,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 21,
              }}
            >
              <Icon name="trash-2" color="#fff" size={16} />
            </Box>
          </TouchableWithoutFeedback>
        </Box>
      </Box>

      <Box style={{ marginLeft: 19, marginRight: 21, width: 162 }}>
        <Text fontFamily="Bold" fontSize={15}>
          {name}
        </Text>

        <Box flexDirection="row" style={{ marginTop: 9, marginBottom: 6 }}>
          <Text style={{ color: "#939393", fontSize: 12 }}>+</Text>
          <Text
            fontSize={11}
            style={{
              color: "#939393",
              marginLeft: 3,
              width: 131,
            }}
          >
            {addons}
          </Text>
        </Box>

        <Text fontSize={13}>৳ {price}</Text>
      </Box>

      <Box alignItems="center">
        <QuantityButton isIncreaseButton onPress={() => onIncrease(id)} />
        <Text style={{ color: "#8A8A8A", fontSize: 17, marginVertical: 10 }}>
          {quantity}
        </Text>
        <QuantityButton onPress={() => onDecrease(id)} />
      </Box>
    </Box>
  );
};

export default OrderItem;
