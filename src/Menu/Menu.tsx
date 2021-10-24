import { observer } from "mobx-react";
import React from "react";
import { Image, ScrollView, TouchableWithoutFeedback } from "react-native";

import type { Theme } from "../components";
import { Box, Text, useTheme, SafeArea, makeStyles } from "../components";
import type { RootStackProps } from "../components/AppNavigator";
import { useAuth } from "../state/hooks/useAuth";
import { useUser } from "../state/hooks/useUser";

import Item from "./Item";

const Menu = observer(({ navigation }: RootStackProps<"MenuStack">) => {
  const theme = useTheme();
  const styles = useStyles();

  const { deauthenticate } = useAuth();
  const { user } = useUser();

  const handleLogout = () => {
    deauthenticate();
    navigation.navigate("BottomTabs", { screen: "Home" });
  };

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
            {user?.firstName} {user?.lastName}
          </Text>
        </Box>

        <Box px="xl">
          <Item
            icon="😎"
            label="My Profile"
            onPress={() =>
              navigation.navigate("MenuStack", { screen: "MyProfile" })
            }
          />
          <Item
            icon="🍔"
            label="My Orders"
            onPress={() =>
              navigation.navigate("MenuStack", { screen: "MyOrders" })
            }
          />
          <Item
            icon="⚙"
            label="Settings"
            onPress={() =>
              navigation.navigate("MenuStack", { screen: "Settings" })
            }
          />
          <Item icon="🧭" label="Store Locator" />
          <Item icon="🚶‍♂️" label="Logout" onPress={handleLogout} />
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
});

export default Menu;

const useStyles = makeStyles((theme: Theme) => ({
  textButton: {
    fontFamily: "Bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
  },
}));
