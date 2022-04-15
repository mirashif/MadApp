import React from "react";
import { Image } from "react-native";

import { Box, CurrencyFormat, Icon, Text } from "../../../components";

const Item = () => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ marginBottom: 17 }}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Image
          source={{
            uri: "https://source.unsplash.com/MqT0asuoIcU/114x114/",
          }}
          style={{ width: 114, height: 114, borderRadius: 12 }}
        />

        <Box style={{ marginLeft: 18 }}>
          <Text fontSize={15} fontFamily="Bold">
            SMG Pizza
          </Text>

          <Box flexDirection="row" width={140} style={{ marginTop: 9 }}>
            <Icon name="plus" color="#939393" />

            <Text fontSize={11} style={{ color: "#939393", marginLeft: 3 }}>
              Cheese, Extra Mushroom, Tomato, Samosa, Black Pepper, Sand Paper,
              Taylor Swift, Jalapenos, Blue Cheese
            </Text>
          </Box>

          <Text style={{ marginTop: 6 }} fontSize={13}>
            <CurrencyFormat value={669.0} />
          </Text>
        </Box>
      </Box>

      <Text fontFamily="Normal" fontSize={17} style={{ color: "#8A8A8A" }}>
        100x
      </Text>
    </Box>
  );
};

export default Item;
