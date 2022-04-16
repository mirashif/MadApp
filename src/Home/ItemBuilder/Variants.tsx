import React from "react";
import { observer } from "mobx-react";

import { Box, Text } from "../../components";
import type { Item as ItemType } from "../../state/store/ItemStore";

import VariantItem from "./VariantItem";

interface VariantGroupsProps {
  item: ItemType | null;
}

const Variants = observer(({ item }: VariantGroupsProps) => {
  const cartable = item?.cartable;
  const variantGroups = cartable?.cartableVariantGroups;

  if (!variantGroups?.length) return null;
  return (
    <>
      {variantGroups.map((variantGroup) => {
        const variantGroupId = variantGroup.variantGroup.data.id;
        const variantGroupName = variantGroup.variantGroup.data.name;
        const variantGroupDescription =
          variantGroup.variantGroup.data.description;
        const variants = variantGroup.variants;
        return (
          <Box key={variantGroupId} style={{ marginBottom: 64 }}>
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

export default Variants;
