import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";

import type { Theme } from "../components";
import { Box, Icon, makeStyles, Text, useTheme } from "../components";
import type { RootStackProps } from "../components/AppNavigator";
import { useAppState } from "../state/StateContext";
import type { LockedAddressStore } from "../state/store/LockedAddressStore";

interface LocationBarProps {
  editMode?: boolean;
  onEditPress?: () => void;
}

const LocationBar = observer(
  ({ editMode = false, onEditPress }: LocationBarProps) => {
    const styles = useStyles();
    const theme = useTheme();
    const navigation =
      useNavigation<RootStackProps<"EditLocation">["navigation"]>();

    const lockedAddress: LockedAddressStore = useAppState("lockedAddress");
    const address = lockedAddress.lockedAddress;

    const addressLine = address?.data.address || "";
    const addressLabel = address?.data.label || "";

    const onEditPressHandler = () => {
      if (onEditPress) {
        onEditPress();
      } else {
        navigation.navigate("EditLocation", { id: address?.data.id ?? null });
      }
    };

    return (
      <TouchableWithoutFeedback onPress={onEditPressHandler}>
        <Box style={styles.container}>
          {address ? (
            <Box>
              <Text numberOfLines={1} style={styles.address}>
                {addressLine}
              </Text>
              <Box style={styles.label}>
                <Icon
                  color={theme.colors.darkGray}
                  name="book-open"
                  size={12}
                />
                <Text numberOfLines={1} style={styles.labelText}>
                  {addressLabel}
                </Text>
              </Box>
            </Box>
          ) : (
            <Box flexDirection="row" alignItems="center">
              <Icon name="navigation" size={14} color={theme.colors.primary} />
              <Text
                style={{ marginLeft: 12 }}
                fontFamily="Bold"
                fontSize={15}
                color="primary"
              >
                Set Your Address
              </Text>
            </Box>
          )}

          <Box
            style={{
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {editMode ? (
              <Icon name="edit-2" size={15} color={theme.colors.primary} />
            ) : (
              <Icon name="chevron-down" size={15} color={theme.colors.gray} />
            )}
          </Box>
        </Box>
      </TouchableWithoutFeedback>
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
    textTransform: "capitalize",
  },
}));
