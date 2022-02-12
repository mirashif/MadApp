import React from "react";
import { observer } from "mobx-react";

import { Box, Text } from "../../components";
import type { Cartable, CartableAddon } from "../../state/store/Cartable";
import type { Item as ItemType } from "../../state/store/ItemStore";

import AddonItem from "./AddonItem";

interface AddonsProps {
  item: ItemType;
}

const Addons = observer(({ item }: AddonsProps) => {
  const cartable: Cartable = item.cartable;
  const addons: CartableAddon[] = cartable.cartableAddons;

  if (!addons.length) return null;
  return (
    <Box style={{ marginBottom: 64 }}>
      <Text variant="modalSectionTitle">Add-ons</Text>
      <Text variant="modalSectionSubtitle">Select one</Text>
      <Box>
        {addons.map((addon) => (
          <AddonItem key={addon.addon.data.id} {...{ addon }} />
        ))}
      </Box>
    </Box>
  );
});

export default Addons;
