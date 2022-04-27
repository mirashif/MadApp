import React from "react";
import { Pressable, Image } from "react-native";

import { Box, Icon, makeStyles, Text, useTheme } from "../../components";

interface StoreProps {
  logoImageURI: string;
  name: string;
  address: string;
  location: { lat: number; lon: number };
  onGetDirections: () => void;
  onDialCall: () => void;
}

const Store = ({
  onDialCall,
  logoImageURI,
  name,
  address,
  onGetDirections,
}: StoreProps) => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Box
      style={{
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box flexDirection="row">
        <Image source={{ uri: logoImageURI }} style={styles.imageStyle} />

        <Box style={{ marginLeft: 13 }}>
          <Text fontFamily="Bold" fontSize={18}>
            {name}
          </Text>

          <Box width={171} mt="s">
            <Text
              fontFamily="Normal"
              fontSize={11}
              style={{ color: "#8A8A8A" }}
            >
              {address}
            </Text>
          </Box>

          {/* TODO: add get direction */}
          <Pressable onPress={onGetDirections}>
            <Text fontFamily="Medium" fontSize={14} color="primary" mt="m">
              Get Directions
            </Text>
          </Pressable>
        </Box>
      </Box>

      <Pressable onPress={onDialCall}>
        <Icon name="phone" size={25} color={theme.colors.primary} />
      </Pressable>
    </Box>
  );
};

export default Store;

const useStyles = makeStyles((theme) => ({
  imageStyle: {
    borderRadius: theme.borderRadii.l,
    backgroundColor: theme.colors.gray,
    width: 48,
    height: 48,
  },
}));
