import { observer } from "mobx-react";
import React from "react";
import { Pressable, View } from "react-native";

import type { Theme } from "../components";
import { Icon, makeStyles, Text, useTheme } from "../components";
import { useAppState } from "../state/StateContext";
import type { Address } from "../state/store/AddressStore";
import type { LockedAddressStore } from "../state/store/LockedAddressStore";

interface LocationBarProps {
  editMode?: boolean;
  onEditPress?: () => void;
}

const LocationBar = observer(
  ({ editMode = false, onEditPress }: LocationBarProps) => {
    const styles = useStyles();
    const theme = useTheme();

    const lockedAddress: LockedAddressStore = useAppState("lockedAddress");
    const address = lockedAddress.lockedAddress?.data;
    const addressLine: string | null = address?.address || null;
    const addressLabel: string | null = address?.label || null;

    return (
      <View style={styles.container}>
        <View>
          <Text numberOfLines={1} style={styles.address}>
            {addressLine && address
              ? addressLine
              : "Set your delivery location"}
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

        <Pressable onPress={onEditPress}>
          <View
            style={{
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!address || editMode ? (
              <Icon name="edit-2" size={15} color={theme.colors.primary} />
            ) : (
              <Icon name="chevron-down" size={15} color={theme.colors.gray} />
            )}
          </View>
        </Pressable>
      </View>
    );
  }
);

export default LocationBar;

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
