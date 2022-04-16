import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

import {
  SafeArea,
  Text,
  Box,
  CircularIcon,
  makeStyles,
} from "../../components";
import { useAppState } from "../../state/StateContext";
import type { Address } from "../../state/store/AddressStore";
import type { LockedAddressStore } from "../../state/store/LockedAddressStore";

import Store from "./Store";

const { height: windowHeight, width } = Dimensions.get("window");
const height = windowHeight * 0.5;

const StoreLocator = () => {
  const styles = useStyles();
  const navigation = useNavigation();

  const lockedAddress: LockedAddressStore = useAppState("lockedAddress");
  const currentlySelectedAddress: Address | null = lockedAddress.lockedAddress;
  const currentlySelectedLocation = currentlySelectedAddress?.builder.location;

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
      <Box style={styles.mapContainer}>
        {/* back button */}
        <Box position="absolute" top={24} left={24}>
          <Pressable onPress={() => navigation.goBack()}>
            <CircularIcon
              name="arrow-left"
              color="#000"
              backgroundColor="#fff"
              size={54}
            />
          </Pressable>
        </Box>
        <MapView
          style={[styles.map, { marginBottom, paddingTop }]}
          region={{
            // currently selcted location ?? dhaka
            latitude: currentlySelectedLocation?.lat ?? 23.8103,
            longitude: currentlySelectedLocation?.lon ?? 90.4125,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={_onMapReady}
        />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box padding="screen">
          <Box style={{ marginTop: 27 }}>
            <Text style={styles.title}>Nearby</Text>

            <Store />
          </Box>

          <Box style={{ marginTop: 60 }}>
            <Text style={styles.title}>Other Locations</Text>

            <Store />
            <Store />
          </Box>
        </Box>
      </ScrollView>
    </SafeArea>
  );
};

const useStyles = makeStyles(() => ({
  title: {
    fontFamily: "Normal",
    fontSize: 18,
  },
  mapContainer: {
    height,
    width,
  },
  map: {
    width,
    height,
  },
}));

export default StoreLocator;
