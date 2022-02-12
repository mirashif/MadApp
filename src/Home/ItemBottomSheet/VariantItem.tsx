import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, Text } from "../../components";
import type { CartableVariant } from "../../state/store/Cartable";

interface VariationItemProps {
  variant: CartableVariant;
}

const VariantItem = ({ variant }: VariationItemProps) => {
  const variants: CartableVariant[] = variantGroup.variants;

  // const variant: CartableVariant = variants[i];

  // const variantImageURI?: string = variant.variant.data.imageURI;
  // const variantName: string = variant.variant.data.name;
  // const variantDescription: string = variant.variant.data.description;
  // const variantPrice: string = variant.variant.data.price;

  // Selection State
  // // // To select a variant.
  // variant.select();

  // // // To know is a variant is selected.
  // const isVariantSelected = variant.isSelected;

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

export default VariantItem;
