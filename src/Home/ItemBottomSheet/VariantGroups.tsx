import React from "react";

import { Box, Text } from "../../components";
import type {
  Cartable,
  CartableVariant,
  CartableVariantGroup,
} from "../../state/store/Cartable";
import type { Item as ItemType } from "../../state/store/ItemStore";

import VariantItem from "./VariantItem";

interface VariantGroupsProps {
  item: ItemType;
}

const VariantGroups = ({ item }: VariantGroupsProps) => {
  const cartable: Cartable = item.cartable;
  const variantGroups: CartableVariantGroup[] = cartable.cartableVariantGroups;

  if (!variantGroups.length) return null;
  return (
    <>
      {variantGroups.map((variantGroup, idx) => {
        const variantGroupName: string = variantGroup.variantGroup.data.name;
        const variantGroupDescription: string =
          variantGroup.variantGroup.data.description;
        const variants: CartableVariant[] = variantGroup.variants;

        return (
          <Box key={idx} style={{ marginTop: 24 }}>
            <Text variant="modalSectionTitle">{variantGroupName}</Text>
            <Text variant="modalSectionSubtitle">
              {variantGroupDescription}
            </Text>

            <Box>
              {variants.map((variant) => (
                <VariantItem {...{ variant }} />
              ))}
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default VariantGroups;
