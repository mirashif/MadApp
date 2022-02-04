import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import Animated, {
  FadingTransition,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Theme } from "../components";
import { Box, Icon, makeStyles, Text, useTheme } from "../components";
import { useAppState } from "../state/StateContext";
import type {
  Address,
  AddressStore,
  AddressType,
} from "../state/store/AddressStore";
import type { LockedAddressStore } from "../state/store/LockedAddressStore";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AddressListModal = observer(({ visible, onClose }: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const addresses: AddressStore = useAppState("addresses");
  const lockedAddress: LockedAddressStore = useAppState("lockedAddress");

  const addressList: Address[] = addresses.all;
  const currentlySelectedAddress: Address | null = lockedAddress.lockedAddress;

  const handleEditLocation = (address: AddressType) => {
    navigation.navigate("EditLocation", { params: address });
  };

  const handleLockAddress = ({ id }: AddressType) => {
    lockedAddress.lockAddress(id);
  };

  if (!visible) return null;
  return (
    <Animated.View layout={FadingTransition} style={styles.backdrop}>
      <Animated.View
        entering={SlideInUp}
        exiting={SlideOutUp}
        style={styles.container}
      >
        <Box style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableWithoutFeedback onPress={onClose}>
            <Icon name="arrow-left" size={24} />
          </TouchableWithoutFeedback>
          <Text ml="m" fontSize={24}>
            Delivery address
          </Text>
        </Box>

        {/* Saved locations */}
        {addressList.map((_address) => {
          const address = _address?.data;
          const currentlySelectedId = currentlySelectedAddress?.data.id ?? "";
          const isSelected = address.id === currentlySelectedId;

          return (
            <Box key={address.id} style={styles.item}>
              <TouchableWithoutFeedback
                // TODO: set selected address
                onPress={() => handleLockAddress(address)}
                style={styles.radioContainer}
              >
                <View>
                  <Box
                    style={[
                      styles.radio,
                      isSelected ? styles.radioSelected : undefined,
                    ]}
                  />

                  <Box style={styles.address}>
                    <Text style={styles.label}>{address.label}</Text>
                    <Text
                      style={styles.street}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {address.address}
                    </Text>
                  </Box>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => handleEditLocation(address)}
                style={styles.editIcon}
              >
                <Icon name="edit-2" size={13} color={theme.colors.primary} />
              </TouchableWithoutFeedback>
            </Box>
          );
        })}

        {/* Use current location */}
        <UseCurrentLocation onEditLocation={handleEditLocation} />

        {/* Add new address */}
        <TouchableWithoutFeedback
          onPress={() => handleEditLocation}
          style={styles.addAddress}
        >
          <View>
            <Icon name="plus" size={23} color={theme.colors.primary} />
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.primary,
                marginLeft: 12,
              }}
            >
              Add a New Address
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Animated.View>
  );
});

export default AddressListModal;

interface IUseCurrentLocation {
  onEditLocation: (address: AddressType) => void;
}

const UseCurrentLocation = observer(
  ({ onEditLocation }: IUseCurrentLocation) => {
    const styles = useStyles();
    const theme = useTheme();

    const addresses: AddressStore = useAppState("addresses");

    const isLocationAddressAvailable: boolean =
      addresses.isLocationAddressAvailable;
    const locationAddress = addresses.locationAddress;

    if (!isLocationAddressAvailable || !locationAddress) return null;
    return (
      <Box style={styles.item}>
        {/* TODO: set selected address */}
        <TouchableWithoutFeedback
          onPress={() => undefined}
          style={styles.radioContainer}
        >
          <Icon name="map-pin" size={18} color={theme.colors.primary} />
          <Box style={styles.address}>
            <Text style={styles.label}>Use Current Location</Text>
            <Text style={styles.street} numberOfLines={1} ellipsizeMode="tail">
              {locationAddress.data.address}
            </Text>
          </Box>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => onEditLocation(locationAddress.data)}
          style={styles.editIcon}
        >
          <Icon name="edit-2" size={13} color={theme.colors.primary} />
        </TouchableWithoutFeedback>
      </Box>
    );
  }
);

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.17)",
  },
  container: {
    backgroundColor: "white",
    paddingVertical: 25,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 25,
    marginBottom: 25,
  },
  item: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginBottom: 30,
  },
  radioContainer: {
    paddingTop: 5,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  radioSelected: {
    backgroundColor: theme.colors.primary,
  },
  address: {
    marginLeft: 15,
    marginRight: 30,
    flexShrink: 1,
    flexGrow: 1,
  },
  label: {
    fontSize: 18,
    color: "#111",
    marginBottom: 5,
  },
  street: {
    fontSize: 14,
    color: "#838383",
  },
  editIcon: {
    height: 13,
    width: 13,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  addAddress: {
    marginHorizontal: 27,
    flexDirection: "row",
    alignItems: "center",
  },
}));
