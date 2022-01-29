import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import type { Region } from "react-native-maps";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

import { SafeArea, Box, makeStyles, Text, Button } from "../../components";
import Input from "../../components/Input";
import DissmissKeyboard from "../../components/DissmissKeyboard";
import { useAppState } from "../../state/StateContext";
import type { AddressStore } from "../../state/store/AddressStore";

import MarkerIcon from "./assets/marker.svg";

const MAP_HEIGHT = 450;
const windowWidth = Dimensions.get("window").width;

const EditLocation = () => {
  const styles = useStyles();
  const navigation = useNavigation();

  const addresses: AddressStore = useAppState("addresses");

  const [formattedAddress, setFormattedAddress] = useState("");
  const [address, setAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);

  const [region, setRegion] = useState<Region | null>(null);

  const handleRegionChange = async (_region: Region) => {
    setRegion(_region);

    await getAndSetAddress(_region.latitude, _region.longitude);
  };

  const setCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0017,
      longitudeDelta: 0.0017,
    });

    addresses.setLocation(longitude, latitude);
    await getAndSetAddress(latitude, longitude);
  };

  const getAndSetAddress = async (latitude: number, longitude: number) => {
    try {
      await Location.setGoogleApiKey("AIzaSyBeg-gj3svjGRcJplqxdmIqHx0hX-dbaj4");

      const addr = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addr.length > 0) {
        setAddress(addr[0]);
        return;
      }

      setAddress(null);
    } catch (err) {
      setAddress(null);
    }
  };

  const saveLocation = async () => {
    const { builder } = addresses;
    if (region) {
      builder.setLocation(region.longitude, region.latitude);
      builder.setAddress(formattedAddress);
      // TODO: Add label fn
      builder.setLabel("HOME");
      const { addressable } = builder;
      await addresses.addAddress(addressable);
    }
    navigation.goBack();
  };

  useEffect(() => {
    if (address) {
      const { name, street, city } = address;
      if (name && !name.includes("+")) {
        if (street) {
          setFormattedAddress(`${name}, ${street}`);
        } else {
          setFormattedAddress(name);
        }

        return;
      }

      if (street) {
        setFormattedAddress(street);
        return;
      }

      if (city) {
        setFormattedAddress(city);
        return;
      }

      setFormattedAddress("");
    }
  }, [address]);

  useEffect(() => {
    setCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeArea>
      <DissmissKeyboard>
        <ScrollView>
          <Box style={styles.mapContainer}>
            {region && (
              <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={handleRegionChange}
                showsMyLocationButton
                provider={PROVIDER_GOOGLE}
              />
            )}

            <Box style={styles.marker}>
              <MarkerIcon />
            </Box>
          </Box>

          <Box style={{ paddingHorizontal: 25, paddingVertical: 30 }}>
            <Text fontFamily="Normal" fontSize={24} mb="xl">
              Edit Address
            </Text>

            <Input
              onChangeText={() => null}
              style={{ padding: 15 }}
              label="Address"
              placeholder="26, Block B, Lalmatia"
              value={formattedAddress}
            />

            <Box style={{ marginBottom: 12 }} />

            <Input
              onChangeText={() => null}
              style={{ padding: 13 }}
              placeholder="Note to rider - e.g landmark / building"
              inputProps={{
                multiline: true,
                numberOfLines: 3,
                textAlignVertical: "top",
              }}
            />

            <Box style={{ marginBottom: 12 }} />

            <Button onPress={saveLocation} size="lg">
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
    position: "relative",
    width: windowWidth,
    height: MAP_HEIGHT,
  },
  map: {
    width: windowWidth,
    height: MAP_HEIGHT,
  },
  marker: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
}));

export default EditLocation;
