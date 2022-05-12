import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native";
import { observer } from "mobx-react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { WebView } from "react-native-webview";

import type { Theme } from "../../../components";
import {
  Box,
  CurrencyFormat,
  HeaderBar,
  Icon,
  makeStyles,
  OrderStageBar,
  SafeArea,
  Text,
  useTheme,
} from "../../../components";
import type { MenuStackProps } from "../..";
import type { OrderStore } from "../../../state/store/OrderStore";
import { useAppState } from "../../../state/StateContext";
import type { RootStackProps } from "../../../components/AppNavigator";

const OrderProcessing = observer(() => {
  const theme = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<RootStackProps<"HomeStack">["navigation"]>();
  const route = useRoute<MenuStackProps<"OrderProcessing">["route"]>();
  const orderId = route.params?.orderId;

  const orders: OrderStore = useAppState("orders");
  const order = orders.get(orderId);

  const showWebView = order?.data.paymentRequired && order?.data.paymentURL;
  const webViewURL = order?.data.paymentURL;
  const displayText = order?.data.displayText || "3D printing the buns...";
  const orderNumber = order?.data.orderNumber || "12345";
  const addressLine = order?.data.address.address || "Address";
  const addressLabel = order?.data.address.label || "Label";
  const totalAmount = order?.data.payments.grandTotalAmount || "5432";
  // TODO: Remove default values
  const timeLeft = order?.data.timeLeft || {
    from: 20,
    to: 40,
  };
  const stage: "waiting" | "preparing" | "delivering" | "complete" =
    order?.triStage || "delivering"; // TODO: triStage does not exist
  const stageNumber: number | null = useMemo(
    () =>
      stage === "preparing"
        ? 1
        : stage === "delivering"
        ? 2
        : stage === "complete"
        ? 3
        : null,
    [stage]
  );

  /**
   * Back button should take the user back to home
   */
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("BottomTabs", { screen: "Home" });
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", () => null);
    }, [navigation])
  );

  if (showWebView && webViewURL) {
    return (
      <SafeArea>
        <WebView source={{ uri: webViewURL }} style={{ flex: 1 }} />
      </SafeArea>
    );
  }

  if (stage === "waiting") {
    return (
      <Box flex={1} justifyContent="center">
        <ActivityIndicator />
      </Box>
    );
  }

  return (
    <SafeArea>
      <ScrollView>
        <HeaderBar
          title="Your Order"
          onBackPress={() =>
            navigation.navigate("BottomTabs", { screen: "Home" })
          }
        />
        <Box alignItems="center">
          {timeLeft && TimeLeft(timeLeft)}
          <StageAnimation {...{ stageNumber }} />
          <Text fontFamily="Normal" fontSize={18} mt="xl">
            {displayText}
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
              {orderNumber}
            </Text>
            <Pressable
              onPress={() =>
                navigation.navigate("MenuStack", {
                  screen: "OrderDetails",
                  params: { orderId },
                })
              }
            >
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
            <DeliveringLocation {...{ addressLine, addressLabel }} />
          </Box>

          <Box mt="xl">
            <Text style={styles.title}>TOTAL AMOUNT</Text>
            <Text fontFamily="Bold" fontSize={34} color="primary">
              <CurrencyFormat value={totalAmount} />
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </SafeArea>
  );
});

const useStyles = makeStyles((theme: Theme) => ({
  title: { fontFamily: "Normal", fontSize: 18, color: "#B0B0B0" },
  container: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: theme.borderRadii.l,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  address: {
    color: theme.colors.primary,
    fontFamily: "Bold",
    fontSize: 15,
    marginBottom: 4,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelText: {
    color: theme.colors.darkGray,
    fontFamily: "Bold",
    fontSize: 11,
    marginLeft: theme.spacing.s,
    textTransform: "capitalize",
  },
}));

export default OrderProcessing;

// TODO: TimeLeft broken
const TimeLeft = (
  timeLeft:
    | { from: number; to: number }
    | { lessThan: number }
    | { string: string }
) => {
  return (
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
      {timeLeft.from && timeLeft.to && (
        <Text fontSize={24} fontFamily="Normal" mr="s">
          {`${timeLeft.from} - ${timeLeft.to}`}
          <Text fontSize={14} style={{ color: "#929292" }}>
            MINS
          </Text>
        </Text>
      )}
      {timeLeft.lessThan && (
        <Text fontSize={24} fontFamily="Normal" mr="s">
          {`${timeLeft.lessThan}`}
          <Text fontSize={14} style={{ color: "#929292" }}>
            MINS
          </Text>
        </Text>
      )}
      {timeLeft.string && (
        <Text fontSize={24} fontFamily="Normal" mr="s">
          {`${timeLeft.string}`}
        </Text>
      )}
    </Box>
  );
};

const StageAnimation = ({ stageNumber }: { stageNumber: number | null }) => {
  switch (stageNumber) {
    case 1:
      return (
        <Box justifyContent="center" alignItems="center">
          <LottieView
            style={{
              width: 250,
              height: 250,
            }}
            source={require("./assets/processing_order.json")}
            autoPlay
            loop
          />
          <OrderStageBar
            stage={1}
            activeBarWidth={188}
            inactiveBarWidth={14}
            containerWidth={238}
          />
        </Box>
      );

    case 2:
      return (
        <Box justifyContent="center" alignItems="center">
          <LottieView
            style={{
              width: 250,
              height: 250,
            }}
            source={require("./assets/on_the_way.json")}
            autoPlay
            loop
          />
          <OrderStageBar
            stage={2}
            activeBarWidth={188}
            inactiveBarWidth={14}
            containerWidth={238}
          />
        </Box>
      );

    case 3:
      return (
        <Box justifyContent="center" alignItems="center">
          <LottieView
            style={{
              width: 250,
              height: 250,
            }}
            source={require("./assets/delivered.json")}
            autoPlay
            loop
          />
          <OrderStageBar
            stage={3}
            activeBarWidth={188}
            inactiveBarWidth={14}
            containerWidth={238}
          />
        </Box>
      );

    default:
      return null;
  }
};

const DeliveringLocation = ({
  addressLine,
  addressLabel,
}: {
  addressLine: string;
  addressLabel: string;
}) => {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <Box style={styles.container}>
      <Box>
        <Text numberOfLines={1} style={styles.address}>
          {addressLine}
        </Text>
        <Box style={styles.label}>
          <Icon color={theme.colors.darkGray} name="book-open" size={12} />
          <Text numberOfLines={1} style={styles.labelText}>
            {addressLabel}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
