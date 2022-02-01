import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import type { Region } from "react-native-maps";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SafeArea, Box, makeStyles, Text, Button } from "../../components";
import Input from "../../components/Input";
import DissmissKeyboard from "../../components/DissmissKeyboard";
import type { AddressBuilder } from "../../state/store/AddressBuilder";
import { useAppState } from "../../state/StateContext";
import type { AddressStore } from "../../state/store/AddressStore";

import MarkerIcon from "./assets/marker.svg";
import Label, { LabelEnum } from "./Label";

import { getFormattedAddress } from ".";

const { height: windowHeight, width } = Dimensions.get("window");
const height = windowHeight * 0.4;

const EditLocation = () => {
  const styles = useStyles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const addressStore: AddressStore = useAppState("addresses");
  const builder: AddressBuilder = addressStore.builder;

  const [label, setLabel] = useState<LabelEnum | string>(LabelEnum.HOME);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [address, setAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);

  const [region, setRegion] = useState<Region>();

  const handleRegionChange = async (_region: Region) => {
    setRegion(_region);
    await getAndSetAddress(_region.latitude, _region.longitude);
  };

  const setCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0017,
      longitudeDelta: 0.0017,
    });
    addressStore.setLocation(longitude, latitude);
    await getAndSetAddress(latitude, longitude);
  };

  const getAndSetAddress = async (latitude: number, longitude: number) => {
    try {
      await Location.setGoogleApiKey("AIzaSyBeg-gj3svjGRcJplqxdmIqHx0hX-dbaj4");
      const _address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (_address.length > 0) return setAddress(_address[0]);
      setAddress(null);
    } catch (err) {
      setAddress(null);
    }
  };

  const saveLocation = async () => {
    if (!region) return;

    const { addressable } = builder;
    builder.setLocation(region.longitude, region.latitude);
    builder.setAddress(formattedAddress);
    builder.setLabel(label);
    await addressStore.addAddress(addressable);

    navigation.goBack();
  };

  useEffect(() => {
    const _address = getFormattedAddress(address);
    setFormattedAddress(_address);
  }, [address]);

  useEffect(() => {
    setCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeArea>
      <DissmissKeyboard>
        <Box style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            provider={PROVIDER_GOOGLE}
            showsCompass={true}
            showsUserLocation={true}
            showsMyLocationButton={true}
            onRegionChangeComplete={handleRegionChange}
          />
          <Box style={styles.marker}>
            <MarkerIcon />
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Box
            padding="screen"
            // Fix: stops the touch event propagation
            onStartShouldSetResponder={() => true}
          >
            <Text fontFamily="Normal" fontSize={24} mb="xl">
              Edit Address
            </Text>
            <Input
              onChangeText={() => null}
              label="Address"
              placeholder="26, Block B, Lalmatia"
              value={formattedAddress}
              style={{
                marginBottom: 12,
              }}
            />
            <Input
              onChangeText={() => null}
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
            <Label onLabelChange={setLabel} />
            <Button
              onPress={saveLocation}
              size="lg"
              style={{
                marginBottom: insets.bottom,
              }}
            >
              Save
            </Button>
          </Box>
        </ScrollView>
      </DissmissKeyboard>
    </SafeArea>
  );
};

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

export default EditLocation;
