import React from "react";

import { Box, CircularIcon, Text } from "../../components";
import type { Addon } from "../../state/store/ItemStore";

interface AddonsItemProps {
  addon: Addon;
}

const AddonsItem = ({ addon }: AddonsItemProps) => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ marginVertical: 7.5 }}
    >
      <Text fontSize={18}>
        + {addon.data.name}{" "}
        <Text fontSize={13} style={{ color: "#BEBEBE" }}>
          ৳ {addon.data.price}
        </Text>
      </Text>

      <Box flexDirection="row">
        <CircularIcon
          color="#8A8A8A"
          backgroundColor="#F8F8F8"
          name="minus"
          size={40}
        />
        <Box width={35} alignItems="center" justifyContent="center">
          <Text
            style={{
              fontFamily: "Normal",
              fontSize: 17,
              color: "#8A8A8A",
            }}
          >
            0
          </Text>
        </Box>
        <CircularIcon name="plus" size={40} />
      </Box>
    </Box>
  );
};

export default AddonsItem;
