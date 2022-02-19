import { observer } from "mobx-react";
import React, { useState } from "react";
import { ScrollView } from "react-native";

import { Box, Text, useTheme } from "../../components";
import { useAppState } from "../../state/StateContext";
import type { CartStore } from "../../state/store/CartStore";
import type { Item } from "../../state/store/ItemStore";
import { ItemBuilder } from "../ItemBuilder";

import UpsellItem from "./UpsellItem";

const UpsellItems = observer(() => {
  const theme = useTheme();

  const cart: CartStore = useAppState("cart");
  const upsellItems: Item[] = cart.upsellItems;

  const [itemBuilderId, setItemBuilderId] = useState<string | null>(null);

  return (
    <>
      <Box style={{ marginTop: 40 }}>
        <Box px="screen">
          <Text style={{ color: "#8A8A8A", fontSize: 18, marginBottom: 21 }}>
            Popular with your order
          </Text>
        </Box>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.screen,
          }}
        >
          {upsellItems.map((item) => (
            <UpsellItem key={item.id} {...{ item }} onAdd={setItemBuilderId} />
          ))}
        </ScrollView>
      </Box>

      <ItemBuilder {...{ itemBuilderId, setItemBuilderId }} />
    </>
  );
});

export default UpsellItems;
