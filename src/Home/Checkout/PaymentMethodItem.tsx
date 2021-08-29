import React from "react";
import { Pressable } from "react-native";

import type { Theme } from "../../components";
import { Box, makeStyles, Text } from "../../components";

import BkashLogo from "./assets/bkash.svg";
import CardIcon from "./assets/card.svg";
import TakaIcon from "./assets/taka.svg";

interface PaymentMethodItemProps {
  active?: boolean;
  type: "bkash" | "cod" | "card";
  onPress?: () => void;
}

const PaymentMethodItem = ({
  active,
  type,
  onPress,
}: PaymentMethodItemProps) => {
  const styles = useStyles();

  let title;

  switch (type) {
    case "bkash":
      title = "bKash";
      break;
    case "cod":
      title = "Cash On Delivery";
      break;
    case "card":
      title = "Credit or Debit Card";
      break;
    default:
      title = "";
  }

  return (
    <Pressable {...{ onPress }}>
      <Box
        my="m"
        px="screen"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box flexDirection="row">
          {type === "bkash" && <BkashLogo />}
          {type === "cod" && <TakaIcon />}
          {type === "card" && <CardIcon />}

          <Text ml="m">{title}</Text>
        </Box>

        {active && <Box style={[styles.radio, styles.radioActive]} />}

        {!active && <Box style={[styles.radio]} />}
      </Box>
    </Pressable>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  radio: {
    borderWidth: 3,
    borderColor: theme.colors.primary,
    height: 24,
    width: 24,
    borderRadius: theme.borderRadii.xl,
  },
  radioActive: {
    backgroundColor: theme.colors.primary,
  },
}));

export default PaymentMethodItem;
