import React from "react";
import { Image, ScrollView, TouchableWithoutFeedback } from "react-native";

import {
  Box,
  Text,
  useTheme,
  SafeArea,
  makeStyles,
  Theme,
} from "../components";
import { RootStackProps } from "../components/AppNavigator";

import Item from "./Item";

const Menu = ({ navigation }: RootStackProps<"MenuStack">) => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 75,
            marginBottom: 30,
          }}
        >
          <Image
            source={{ uri: "https://picsum.photos/134" }}
            style={{ borderRadius: 134, height: 134, width: 134 }}
          />
          <Text
            style={{
              fontFamily: "Normal",
              fontSize: 25,
              color: theme.colors.foreground,
              marginTop: 18,
            }}
          >
            Rabbi Mehedi
          </Text>
        </Box>

        <Box px="xl">
          <Item icon="😎" label="My Profile" />
          <Item
            icon="🍔"
            label="My Orders"
            onPress={() =>
              navigation.navigate("MenuStack", { screen: "MyOrders" })
            }
          />
          <Item icon="⚙" label="Settings" />
          <Item icon="🧭" label="Store Locator" />
          <Item icon="🚶‍♂️" label="Logout" />
        </Box>

        <Box style={{ marginHorizontal: 72, marginVertical: 12 }}>
          <TouchableWithoutFeedback onPress={() => console.log("terms")}>
            <Text style={styles.textButton}>Terms & Conditions</Text>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => console.log("policy")}>
            <Text style={styles.textButton}>Privacy Policy</Text>
          </TouchableWithoutFeedback>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

export default Menu;

const useStyles = makeStyles((theme: Theme) => ({
  textButton: {
    fontFamily: "Bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
  },
}));
