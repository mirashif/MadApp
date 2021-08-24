import React from "react";
import { Pressable } from "react-native";

import { Box, Text } from "../../components";

interface ActiveOrderItemProps {
  onPress: () => void;
}

const ActiveOrderItem = ({ onPress }: ActiveOrderItemProps) => {
  return (
    <Pressable {...{ onPress }}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ paddingHorizontal: 32, paddingVertical: 8, marginBottom: 30 }}
      >
        <Box>
          <Text fontSize={16} fontFamily="Bold">
            Madchef x Cheez
          </Text>
          <Text style={{ marginTop: 2 }}>৳619.00</Text>

          <Box mt="m">
            <Text fontSize={11} style={{ color: "#939393" }}>
              2x Cheez: SMG{"\n"}1x Cheez: Beef Shorisha{"\n"}3x Madchef: Cajun
              Fries
            </Text>
          </Box>

          <Text
            mt="s"
            fontSize={11}
            fontFamily="Bold"
            style={{ color: "#2BBFFF" }}
          >
            ACTIVE
          </Text>
        </Box>

        <Box alignItems="center">
          <Text fontSize={11}>ESTIMATED TIME</Text>

          <Box
            width={107}
            height={60}
            borderRadius="m"
            alignItems="center"
            justifyContent="center"
            style={{ backgroundColor: "#FFE164", marginTop: 6 }}
          >
            <Text fontSize={22} style={{ color: "#383838" }}>
              30-40
            </Text>
            <Text fontSize={12} style={{ color: "#383838" }}>
              MINS
            </Text>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
};

export default ActiveOrderItem;
