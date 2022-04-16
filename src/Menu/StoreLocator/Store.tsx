import React from "react";
import { Pressable, Image } from "react-native";

import { Box, Icon, Text, useTheme } from "../../components";

const Store = () => {
  const theme = useTheme();

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
        <Image
          source={{ uri: "https://cutt.ly/QWjYTaA" }}
          style={{ width: 48, height: 48 }}
        />

        <Box style={{ marginLeft: 13 }}>
          <Text fontFamily="Bold" fontSize={18}>
            Cheez Uttara
          </Text>

          <Box width={171} mt="s">
            <Text
              fontFamily="Normal"
              fontSize={11}
              style={{ color: "#8A8A8A" }}
            >
              Gareeb-e-Nawaz Avenue, House 34, Sector 11, Dhaka
            </Text>
          </Box>

          <Pressable>
            <Text fontFamily="Medium" fontSize={14} color="primary" mt="m">
              Get Directions
            </Text>
          </Pressable>
        </Box>
      </Box>

      <Pressable>
        <Icon name="phone" size={25} color={theme.colors.primary} />
      </Pressable>
    </Box>
  );
};

export default Store;
