import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import Animated, {
  FadingTransition,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Theme } from "../components";
import { Box, Icon, makeStyles, Text, useTheme } from "../components";
import type { RootStackProps } from "../components/AppNavigator";
import { useAppState } from "../state/StateContext";
import type {
  Address,
  AddressStore,
  AddressType,
} from "../state/store/AddressStore";
import type { LockedAddressStore } from "../state/store/LockedAddressStore";

interface AddressListModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddressListModal = observer(
  ({ visible, onClose }: AddressListModalProps) => {
    const styles = useStyles();
    const theme = useTheme();
    const navigation =
      useNavigation<RootStackProps<"EditLocation">["navigation"]>();
    const insets = useSafeAreaInsets();

    const addresses: AddressStore = useAppState("addresses");
    const lockedAddress: LockedAddressStore = useAppState("lockedAddress");

    const addressList: Address[] = addresses.all;
    const currentlySelectedAddress: Address | null =
      lockedAddress.lockedAddress;

    const handleEditLocation = (id: string | null) => {
      navigation.navigate("EditLocation", { id });
    };

    const handleLockAddress = ({ id }: AddressType) => {
      lockedAddress.lockAddress(id);
    };

    if (!visible) return null;
    return (
      <Animated.View layout={FadingTransition} style={styles.backdrop}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
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
              <TouchableWithoutFeedback
                key={address.id}
                onPress={() => handleLockAddress(address)}
              >
                <Box style={styles.item}>
                  <Box style={styles.radioContainer}>
                    <Box
                      style={[
                        styles.radio,
                        isSelected ? styles.radioSelected : undefined,
                      ]}
                    />
                  </Box>

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

                  <TouchableWithoutFeedback
                    onPress={() => handleEditLocation(address.id)}
                    style={styles.editIcon}
                  >
                    <Icon
                      name="edit-2"
                      size={13}
                      color={theme.colors.primary}
                    />
                  </TouchableWithoutFeedback>
                </Box>
              </TouchableWithoutFeedback>
            );
          })}

          {/* Use current location */}
          <UseCurrentLocation
            onEditLocation={() => handleEditLocation("location")}
          />

          {/* Add new address */}
          <TouchableWithoutFeedback onPress={() => handleEditLocation(null)}>
            <Box style={styles.addAddress}>
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
            </Box>
          </TouchableWithoutFeedback>
        </Animated.ScrollView>
      </Animated.View>
    );
  }
);

export default AddressListModal;

interface IUseCurrentLocation {
  onEditLocation: (address: AddressType) => void;
}

const UseCurrentLocation = observer(
  ({ onEditLocation }: IUseCurrentLocation) => {
    const styles = useStyles();
    const theme = useTheme();

    const addresses: AddressStore = useAppState("addresses");
    const lockedAddress: LockedAddressStore = useAppState("lockedAddress");

    const isLocationAddressAvailable: boolean =
      addresses.isLocationAddressAvailable;
    const locationAddress = addresses.locationAddress;

    const handleLockCurrentLocation = async () => {
      lockedAddress.lockAddress("location" as string);
    };

    if (!isLocationAddressAvailable || !locationAddress) return null;
    return (
      <TouchableWithoutFeedback onPress={handleLockCurrentLocation}>
        <Box style={styles.item}>
          <Box style={styles.radioContainer}>
            <Icon name="map-pin" size={18} color={theme.colors.primary} />
            <Box style={styles.address}>
              <Text style={styles.label}>Use Current Location</Text>
              <Text
                style={styles.street}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {locationAddress.data.address}
              </Text>
            </Box>
          </Box>

          <TouchableWithoutFeedback
            onPress={() => onEditLocation(locationAddress.data)}
            style={styles.editIcon}
          >
            <Icon name="edit-2" size={13} color={theme.colors.primary} />
          </TouchableWithoutFeedback>
        </Box>
      </TouchableWithoutFeedback>
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
    flexGrow: 0,
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
    textTransform: "capitalize",
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
