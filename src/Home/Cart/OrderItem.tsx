import { observer } from "mobx-react";
import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";

import { Box, Icon, Text, useTheme } from "../../components";
import type { CartableWrapper } from "../../state/store/CartStore";

import { QuantityButton } from "./Button";

interface OrderItemProps {
  item: CartableWrapper;
  onDelete: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

const OrderItem = observer((props: OrderItemProps) => {
  const theme = useTheme();
  const { item, onDelete, onIncrease, onDecrease } = props;

  return (
    <Box flexDirection="row" alignItems="center" marginBottom="l">
      <Box position="relative">
        <Image
          source={{
            uri: item.itemThumbnailURI,
          }}
          style={{
            width: 114,
            height: 114,
            borderRadius: 12,
            backgroundColor: theme.colors.gray,
          }}
        />

        <Box position="absolute" bottom={-3} right={-8}>
          <TouchableWithoutFeedback onPress={onDelete}>
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
          {item.itemName}
        </Text>

        {!!item.additions && (
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
              {item.additions}
            </Text>
          </Box>
        )}

        <Text fontSize={13}>৳ {item.totalPrice}</Text>
      </Box>

      <Box alignItems="center">
        <QuantityButton isIncreaseButton onPress={onIncrease} />
        <Text style={{ color: "#8A8A8A", fontSize: 17, marginVertical: 10 }}>
          {item.count}
        </Text>
        <QuantityButton onPress={onDecrease} />
      </Box>
    </Box>
  );
});

export default OrderItem;
