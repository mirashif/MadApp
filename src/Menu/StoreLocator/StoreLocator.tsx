import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, ScrollView } from "react-native";

import {
  SafeArea,
  Text,
  Box,
  CircularIcon,
  makeStyles,
} from "../../components";

import Store from "./Store";

const StoreLocator = () => {
  const styles = useStyles();
  const navigation = useNavigation();

  return (
    <SafeArea>
      <Box style={{ backgroundColor: "#f3f3f3", flex: 1 }}>
        <Box position="absolute" top={24} left={24}>
          <Pressable onPress={() => navigation.goBack()}>
            <CircularIcon
              name="arrow-left"
              color="#000"
              backgroundColor="#fff"
              size={54}
            />
          </Pressable>
        </Box>

        <Box position="absolute" bottom={18} right={18}>
          <CircularIcon
            name="crosshair"
            size={45}
            color="#000"
            backgroundColor="#fff"
          />
        </Box>
      </Box>

      <Box style={{ paddingHorizontal: 32, height: 350 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box style={{ marginTop: 27 }}>
            <Text style={styles.title}>Nearby</Text>

            <Store />
          </Box>

          <Box style={{ marginTop: 60 }}>
            <Text style={styles.title}>Other Locations</Text>

            <Store />
            <Store />
          </Box>
        </ScrollView>
      </Box>
    </SafeArea>
  );
};

const useStyles = makeStyles(() => ({
  title: {
    fontFamily: "Normal",
    fontSize: 18,
  },
}));

export default StoreLocator;
