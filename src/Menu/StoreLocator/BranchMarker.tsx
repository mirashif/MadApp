import React from "react";
import { Image, Pressable } from "react-native";
import { Marker } from "react-native-maps";

import { Box, Text } from "../../components";

import ArrowBottom from "./assets/ArrowBottom.svg";

interface BranchMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  logoImageURI: string;
  name: string;
  onGetDirection: () => void;
}

const BranchMarker = ({
  coordinate,
  logoImageURI,
  name,
  onGetDirection,
  ...marker
}: BranchMarkerProps) => {
  return (
    <Marker coordinate={coordinate}>
      <Box alignItems="center">
        <Box
          position="relative"
          flexDirection="row"
          backgroundColor="background"
          paddingVertical="s"
          paddingHorizontal="m"
          {...marker}
        >
          <Image
            source={{
              uri: logoImageURI,
            }}
            style={{
              height: 22,
              width: 22,
              marginRight: 6,
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
            <Pressable onPress={onGetDirection}>
              <Text
                style={{
                  fontFamily: "Normal",
                  fontSize: 7,
                  color: "#FF385A",
                }}
              >
                Get Directions
              </Text>
            </Pressable>
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
