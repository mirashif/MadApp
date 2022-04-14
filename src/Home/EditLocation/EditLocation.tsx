import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { observer } from "mobx-react";

import { SafeArea, Box, makeStyles, Text, Button } from "../../components";
import Input from "../../components/Input";
import DissmissKeyboard from "../../components/DissmissKeyboard";
import type {
  AddressStore,
  UnsavedAddressType,
} from "../../state/store/AddressStore";
import { useAppState } from "../../state/StateContext";
import type { AddressBuilder } from "../../state/store/AddressBuilder";
import type { RootStackProps } from "../../components/AppNavigator";
import type { LockedAddressStore } from "../../state/store/LockedAddressStore";

import MarkerIcon from "./assets/marker.svg";
import Label from "./Label";

const { height: windowHeight, width } = Dimensions.get("window");
const height = windowHeight * 0.4;

const EditLocation = observer(() => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<RootStackProps<"EditLocation">["navigation"]>();
  const route = useRoute<RootStackProps<"EditLocation">["route"]>();
  const { id } = route?.params;

  const addresses: AddressStore = useAppState("addresses");
  const lockedAddress: LockedAddressStore = useAppState("lockedAddress");

  const builder: AddressBuilder = useMemo(() => {
    if (id === "location" || null) {
      // new addresses
      return addresses.builder;
    } else {
      // address editing
      const _address = addresses.get(id as string);
      return _address ? _address.builder : addresses.builder;
    }
  }, [addresses, id]);

  const handleSaveAddress = async () => {
    const addressable: UnsavedAddressType = builder.addressable;

    try {
      if (id) await addresses.updateAddress(id as string, addressable);
      else {
        await addresses.addAddress(addressable);
        lockedAddress.lockAddress(addresses.all[0].data.id);
      }
    } catch (error) {
      console.error(error);
    }

    navigation.goBack();
  };

  const handleDeleteAddress = async () => {
    await addresses.deleteAddress(id as string);
    navigation.goBack();
  };

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);

  const checkIfLocationEnabled = async () => {
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) return;
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
  };

  // Fix for android showsMyLocationButton
  // https://github.com/react-native-maps/react-native-maps/issues/2010
  const [paddingTop, setPaddingTop] = useState(1);
  const [marginBottom, setMarginBottom] = useState(1);
  const _onMapReady = () => {
    setMarginBottom(0);
    setPaddingTop(0);
  };

  return (
    <SafeArea>
      <DissmissKeyboard>
        <Box style={styles.mapContainer}>
          <MapView
            style={[styles.map, { marginBottom, paddingTop }]}
            region={{
              // builder location ?? dhaka
              latitude: builder.location?.lat ?? 23.8103,
              longitude: builder.location?.lon ?? 90.4125,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            provider={PROVIDER_GOOGLE}
            showsCompass={true}
            showsUserLocation={true}
            showsMyLocationButton={true}
            onRegionChangeComplete={(region) =>
              builder.setLocation(
                region.longitude as number,
                region.latitude as number
              )
            }
            onMapReady={_onMapReady}
          />
          <Box style={styles.marker}>
            <MarkerIcon />
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Box
            padding="screen"
            // stops the touch event propagation
            onStartShouldSetResponder={() => true}
          >
            <Text fontFamily="Normal" fontSize={24} mb="xl">
              Edit Address
            </Text>
            <Input
              value={builder.address}
              onChangeText={(_address) =>
                builder.setAddress(_address as string)
              }
              inputProps={{
                editable:
                  builder.isAddressInferring || !builder.isAddressInferred,
              }}
              label="Address"
              placeholder="26, Block B, Lalmatia"
              style={{
                marginBottom: 12,
              }}
            />
            <Input
              value={builder.directions}
              onChangeText={(_directions) =>
                builder.setDirections(_directions as string)
              }
              placeholder="Note to rider - e.g landmark / building"
              inputProps={{
                multiline: true,
                numberOfLines: 3,
                textAlignVertical: "top",
              }}
              style={{
                // Fix: ios multi-line
                height: 32 * 3,
                paddingTop: 16,
                paddingBottom: 16,
                marginBottom: 16,
              }}
            />
            <Label
              label={builder.label || null}
              onChange={(_label) => builder.setLabel(_label as string)}
            />
            <Button
              onPress={handleSaveAddress}
              size="lg"
              style={{
                marginBottom: 15,
              }}
            >
              Save
            </Button>
            {id && (
              <Box
                style={{
                  marginBottom: insets.bottom,
                }}
              >
                <Button
                  onPress={handleDeleteAddress}
                  size="lg"
                  variant="outlined"
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>
        </ScrollView>
      </DissmissKeyboard>
    </SafeArea>
  );
});

export default EditLocation;

const useStyles = makeStyles(() => ({
  mapContainer: {
    width,
    height,
  },
  map: {
    width,
    height,
  },
  marker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -50,
    marginTop: -50,
    pointerEvents: "none",
  },
}));
