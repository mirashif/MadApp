import { observer } from "mobx-react";
import React from "react";

import { Box, Text } from "../../components";
import type {
  Cartable,
  CartableVariantGroup,
} from "../../state/store/Cartable";
import type { Item as ItemType } from "../../state/store/ItemStore";

import VariantItem from "./VariantItem";

interface VariantGroupsProps {
  item: ItemType;
}

const VariantGroups = observer(({ item }: VariantGroupsProps) => {
  const cartable: Cartable = item.cartable;
  const variantGroups: CartableVariantGroup[] = cartable.cartableVariantGroups;

  if (!variantGroups.length) return null;
  return (
    <>
      {variantGroups.map((variantGroup) => {
        const variantGroupId = variantGroup.variantGroup.data.id;
        const variantGroupName = variantGroup.variantGroup.data.name;
        const variantGroupDescription =
          variantGroup.variantGroup.data.description;
        const variants = variantGroup.variants;
        return (
          <Box key={variantGroupId} style={{ marginTop: 24 }}>
            <Text variant="modalSectionTitle">{variantGroupName}</Text>
            <Text variant="modalSectionSubtitle">
              {variantGroupDescription}
            </Text>

            <Box>
              {variants.map((variant) => (
                <VariantItem key={variant.variant.data.id} {...{ variant }} />
              ))}
            </Box>
          </Box>
        );
      })}
    </>
  );
});

export default VariantGroups;
