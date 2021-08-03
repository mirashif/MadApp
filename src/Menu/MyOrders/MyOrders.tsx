import React from "react";
import { ScrollView } from "react-native-gesture-handler";

import {
  Box,
  HeaderBar,
  makeStyles,
  SafeArea,
  Theme,
  Text,
} from "../../components";

const MyOrders = () => {
  const styles = useStyles();

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="My Orders" />

        <Box style={styles.notice}>
          <Text color="primary">You earn cashback from every order!</Text>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  notice: {
    borderRadius: theme.borderRadii.l,
    marginHorizontal: theme.spacing.screen,
    paddingHorizontal: 18,
    backgroundColor: "#FFE5EA",
    height: 51,
    justifyContent: "center",
  },
}));

export default MyOrders;
