import React from "react";
import { Image } from "react-native";
import { Marker } from "react-native-maps";

import { Box, Text, useTheme } from "../../components";

import ArrowBottom from "./assets/ArrowBottom.svg";

interface BranchMarkerProps {
  location: { lat: number; lon: number };
  logoImageURI: string;
  name: string;
  onGetDirection: () => void;
}

const BranchMarker = ({
  location,
  logoImageURI,
  name,
  onGetDirection,
}: BranchMarkerProps) => {
  const theme = useTheme();

  return (
    <Marker
      coordinate={{
        latitude: location.lat,
        longitude: location.lon,
      }}
      onPress={onGetDirection}
    >
      <Box alignItems="center">
        <Box
          position="relative"
          flexDirection="row"
          backgroundColor="background"
          paddingVertical="s"
          paddingHorizontal="m"
        >
          <Image
            source={{
              uri: logoImageURI,
            }}
            style={{
              height: 22,
              width: 22,
              marginRight: 6,
              backgroundColor: theme.colors.gray,
            }}
          />

          <Box justifyContent="center">
            <Text
              style={{
                fontFamily: "Bold",
                fontSize: 8,
                color: "#000000",
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                fontFamily: "Normal",
                fontSize: 7,
                color: "#FF385A",
              }}
            >
              Get Directions
            </Text>
          </Box>
        </Box>
        <Box>
          <ArrowBottom />
        </Box>
      </Box>
    </Marker>
  );
};

export default BranchMarker;
