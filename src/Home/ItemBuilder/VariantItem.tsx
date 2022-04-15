import { observer } from "mobx-react";
import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";

import { Box, Text } from "../../components";
import type { CartableVariant } from "../../state/store/Cartable";

interface VariationItemProps {
  variant: CartableVariant;
}

const VariantItem = observer(({ variant }: VariationItemProps) => {
  const variantImageURI = variant.variant.data.imageURI;
  const variantName = variant.variant.data.name;
  const variantPrice = variant.variant.data.price;
  const isVariantSelected = variant.isSelected;
  return (
    <TouchableWithoutFeedback onPress={() => variant.select()}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        style={{ marginVertical: 7.5 }}
      >
        <Box flexDirection="row" alignItems="center">
          <Box
            height={15}
            width={15}
            borderWidth={2}
            borderColor="primary"
            borderRadius="xl"
            backgroundColor={isVariantSelected ? "primary" : "background"}
          />
          {variantImageURI && (
            <Image
              source={{
                uri: variantImageURI,
              }}
              style={{
                height: 68,
                width: 68,
                borderRadius: 12,
                backgroundColor: "#bebebe",
                marginLeft: 15,
              }}
            />
          )}
          <Text ml="m" fontSize={18}>
            {variantName}
          </Text>
        </Box>
        <Text fontSize={18}>৳ {variantPrice.toLocaleString("en-IN")}</Text>
      </Box>
    </TouchableWithoutFeedback>
  );
});

export default VariantItem;
