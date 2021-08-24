import React from "react";
import { Pressable, ScrollView } from "react-native";
import LottieView from "lottie-react-native";

import {
  Box,
  HeaderBar,
  Icon,
  makeStyles,
  SafeArea,
  Text,
  useTheme,
} from "../../../components";
import LocationBar from "../../../Home/LocationBar";

const StepsIndicator = ({ active }: { active?: boolean }) => (
  <Box
    borderRadius="xl"
    style={{
      width: active ? 188 : 14,
      height: 8,
      backgroundColor: active ? "#FF385A" : "#CBCBCB",
    }}
  />
);

const OrderProcessing = () => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <SafeArea>
      <ScrollView>
        <HeaderBar title="Your Order" />

        <Box alignItems="center">
          <Box
            style={{
              marginTop: 38,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text fontSize={36} mr="m">
              🕒
            </Text>

            <Text fontSize={24} fontFamily="Normal" mr="s">
              20 - 25{" "}
              <Text style={{ fontSize: 14, color: "#929292" }}>MINS</Text>
            </Text>
          </Box>

          <Box>
            <LottieView
              style={{
                width: 250,
                height: 250,
              }}
              source={require("./assets/processing.json")}
              autoPlay
              loop
            />
          </Box>

          <Box width={238} justifyContent="space-between" flexDirection="row">
            <StepsIndicator active />
            <StepsIndicator />
            <StepsIndicator />
          </Box>

          <Text fontFamily="Normal" fontSize={18} mt="xl">
            3D printing the buns...
          </Text>
        </Box>

        <Box
          paddingHorizontal="screen"
          style={{ marginTop: 98, marginBottom: 35 }}
        >
          <Text style={styles.title}>Order#</Text>

          <Box
            mt="s"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontFamily="Bold" fontSize={34} color="primary">
              25809
            </Text>

            <Pressable>
              <Box flexDirection="row" alignItems="center">
                <Text fontFamily="Medium" color="primary" mr="s">
                  View Order Details
                </Text>
                <Icon
                  name="chevron-right"
                  size={24}
                  color={theme.colors.primary}
                />
              </Box>
            </Pressable>
          </Box>

          <Box style={{ marginTop: 30 }}>
            <Text mb="s" style={styles.title}>
              Delivering to
            </Text>

            <LocationBar
              address="5 Rd No. 2/3, Dhaka 1213"
              label="Office"
              editMode
              onEditPress={() => null}
            />
          </Box>

          <Box mt="xl">
            <Text style={styles.title}>TOTAL AMOUNT</Text>
            <Text fontFamily="Bold" fontSize={34} color="primary">
              ৳ 2,809
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

const useStyles = makeStyles(() => ({
  title: { fontFamily: "Normal", fontSize: 18, color: "#B0B0B0" },
}));

export default OrderProcessing;
