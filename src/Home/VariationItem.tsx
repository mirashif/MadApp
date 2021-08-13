import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Text } from "../components";

interface VariationItemProps {
  selected?: boolean;
  name: string;
  price: number;
  onPress: () => void;
}

const VariationItem = ({
  selected = false,
  onPress,
  name,
  price,
}: VariationItemProps) => {
  return (
    <TouchableWithoutFeedback {...{ onPress }}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        style={{ paddingVertical: 7.5 }}
      >
        <Box flexDirection="row" alignItems="center">
          <Box
            height={15}
            width={15}
            borderWidth={2}
            borderColor="primary"
            borderRadius="xl"
            backgroundColor={selected ? "primary" : "background"}
          />
          <Text ml="m" fontSize={18}>
            {name}
          </Text>
        </Box>

        <Text fontSize={18}>৳ {price}</Text>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default VariationItem;
