import React from "react";
import { Pressable, View } from "react-native";

import type { Theme } from "../components";
import { Icon, makeStyles, Text, useTheme } from "../components";
import { useAppState } from "../state/StateContext";
import type { Address } from "../state/store/AddressStore";
import type { LockedAddressStore } from "../state/store/LockedAddressStore";

interface LocationBarProps {
  showIcon?: boolean;
  editMode?: boolean;
  onEditPress?: () => void;
}

export default function LocationBar({
  editMode = false,
  onEditPress,
  showIcon = true,
}: LocationBarProps) {
  const styles = useStyles();
  const theme = useTheme();

  const lockedAddress: LockedAddressStore = useAppState("lockedAddress");
  const address: Address | null = lockedAddress.lockedAddress;
  const addressLine: string | null = address?.data.address || null;
  const addressLabel: string | null = address?.data.label || null;

  return (
    <View style={styles.container}>
      <View>
        <Text numberOfLines={1} style={styles.address}>
          {addressLine && address ? addressLine : "Set your delivery location"}
        </Text>
        {addressLabel && (
          <View style={styles.label}>
            <Icon color={theme.colors.darkGray} name="book-open" size={12} />
            <Text numberOfLines={1} style={styles.labelText}>
              {addressLabel}
            </Text>
          </View>
        )}
      </View>

      {showIcon && (
        <View>
          {!address || editMode ? (
            <Pressable onPress={onEditPress}>
              <Icon name="edit-2" size={15} color={theme.colors.primary} />
            </Pressable>
          ) : (
            <Icon name="chevron-down" size={15} color={theme.colors.gray} />
          )}
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginHorizontal: theme.spacing.screen,
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
  },
}));
