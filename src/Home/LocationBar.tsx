import React from "react";
import { View } from "react-native";

import { Icon, makeStyles, Text, Theme, useTheme } from "../components";

export default function LocationBar() {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View>
        <Text numberOfLines={1} style={styles.address}>
          5 Rd No. 2/3, Dhaka 1213
        </Text>
        <View style={styles.labelContainer}>
          <Icon name="book-open" size={12} />
          <Text numberOfLines={1} style={styles.label}>
            Scratchboard
          </Text>
        </View>
      </View>
      <Icon name="chevron-down" size={15} color={theme.colors.gray} />
    </View>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: theme.borderRadii.l,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  address: {
    color: theme.colors.primary,
    fontFamily: "Bold",
    fontSize: 15,
    marginBottom: 4,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: theme.colors.darkGray,
    fontFamily: "Bold",
    fontSize: 11,
    marginLeft: theme.spacing.s,
  },
}));
