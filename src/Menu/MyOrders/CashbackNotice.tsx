import React from "react";

import { Box, Text } from "../../components";

import ConfettiEmoji from "./assets/ConfettiEmoji.svg";

const CashbackNotice = () => {
  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      style={{ marginTop: 16, marginBottom: 39 }}
    >
      <ConfettiEmoji />

      <Box width={180} style={{ marginLeft: 17 }}>
        <Text fontSize={14}>
          <Text fontFamily="Bold">Did You Know?</Text> You earn cashback from
          every order!
        </Text>
      </Box>
    </Box>
  );
};

export default CashbackNotice;
