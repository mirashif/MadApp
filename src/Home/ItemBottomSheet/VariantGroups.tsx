import React from "react";

import { Box, Text } from "../../components";
import type {
  Cartable,
  CartableVariantGroup,
} from "../../state/store/Cartable";
import type { Item as ItemType } from "../../state/store/ItemStore";

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

        return (
          <Box key={idx} style={{ marginTop: 24 }}>
            <Text variant="modalSectionTitle">{variantGroupName}</Text>
            <Text variant="modalSectionSubtitle">
              {variantGroupDescription}
            </Text>
          </Box>
        );
      })}
    </>
  );

  // {/* <View style={{ marginTop: 24 }}>
  //   <Text style={styles.modalSectionTitle}>Variation</Text>
  //   <Text style={styles.modalSectionSubtitle}>Select one</Text>

  //   <Box>
  //     {variations.map((variation) => (
  //       <VariationItem
  //         key={variation.id}
  //         name={variation.name}
  //         price={variation.price}
  //         selected={variation.id === selectedVariationID}
  //         onPress={() => setSelectedVariationID(variation.id)}
  //       />
  //     ))}
  //   </Box>
  // </View> */}
};

export default VariantGroups;
