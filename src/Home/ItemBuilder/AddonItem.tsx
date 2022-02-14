import React from "react";
import { observer } from "mobx-react";
import { TouchableWithoutFeedback } from "react-native";

import { Box, CircularIcon, Text } from "../../components";
import type { CartableAddon } from "../../state/store/Cartable";

interface AddonsItemProps {
  addon: CartableAddon;
}

const AddonItem = observer(({ addon }: AddonsItemProps) => {
  const addonName = addon.addon.data.name;
  const addonPrice = addon.addon.data.price;
  const addonCount = addon.count;
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ marginVertical: 7.5 }}
    >
      <Text fontSize={18}>
        + {addonName}{" "}
        <Text fontSize={13} style={{ color: "#BEBEBE" }}>
          ৳ {addonPrice}
        </Text>
      </Text>

      <Box flexDirection="row">
        <TouchableWithoutFeedback onPress={() => addon.decrement()}>
          <CircularIcon
            color="#8A8A8A"
            backgroundColor="#F8F8F8"
            name="minus"
            size={40}
          />
        </TouchableWithoutFeedback>
        <Box width={35} alignItems="center" justifyContent="center">
          <Text
            style={{
              fontFamily: "Normal",
              fontSize: 17,
              color: "#8A8A8A",
            }}
          >
            {addonCount}
          </Text>
        </Box>
        <TouchableWithoutFeedback onPress={() => addon.increment()}>
          <CircularIcon name="plus" size={40} />
        </TouchableWithoutFeedback>
      </Box>
    </Box>
  );
});

export default AddonItem;
