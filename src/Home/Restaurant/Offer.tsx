import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import * as Linking from "expo-linking";

import { Box, Text, CircularIcon, useTheme } from "../../components";

const SIZE = 58;

interface OfferProps {
  title: string;
  description: string;
  telephone: string;
}

const Offer = ({ title, description, telephone }: OfferProps) => {
  const theme = useTheme();

  return (
    <Box
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        marginTop: -(SIZE / 2),
        marginBottom: 15,
      }}
    >
      <Box
        style={{
          flex: 1,
          borderRadius: theme.borderRadii.l,
          backgroundColor: theme.colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 18,
          marginRight: 8,
        }}
      >
        <Text
          style={{
            fontFamily: "Bold",
            fontSize: 16,
            color: theme.colors.primaryContrast,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Normal",
            fontSize: 12,
            color: theme.colors.primaryContrast,
          }}
        >
          {description}
        </Text>
      </Box>
      <TouchableWithoutFeedback
        onPress={() => {
          Linking.openURL(`tel:${telephone}`);
        }}
      >
        <CircularIcon name="phone" size={SIZE} />
      </TouchableWithoutFeedback>
    </Box>
  );
};

export default Offer;
