import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { observer } from "mobx-react";
import * as Linking from "expo-linking";

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
import type { Branch, BranchStore } from "../../state/store/BranchStore";

import Store from "./Store";
import BranchMarker from "./BranchMarker";

const { height: windowHeight, width } = Dimensions.get("window");
const height = windowHeight * 0.5;

const StoreLocator = observer(() => {
  const styles = useStyles();
  const navigation = useNavigation();

  const lockedAddress: LockedAddressStore = useAppState("lockedAddress");
  const currentlySelectedAddress: Address | null = lockedAddress.lockedAddress;
  const currentlySelectedLocation = currentlySelectedAddress?.builder.location;

  const branchStore: BranchStore = useAppState("branches");
  const branches: Branch[] = branchStore.all;
  const nearbyBranches: Branch[] = branchStore.availableBranches;

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

  const openDirection = ({ lat, lon }: { lat: number; lon: number }) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentlySelectedLocation?.lat},${currentlySelectedLocation?.lon}&destination=${lat},${lon}`;
    Linking.openURL(url);
  };

  const dialCall = (phone: string | undefined) => {
    if (!phone) return;
    let phoneNumber: string;

    if (Platform.OS === "android") {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }

    Linking.openURL(phoneNumber);
  };

  return (
    <SafeArea>
      <Box style={styles.mapContainer}>
        <MapView
          style={[styles.map, { marginBottom, paddingTop }]}
          region={{
            // selected location ?? dhaka
            latitude: currentlySelectedLocation?.lat ?? 23.746768,
            longitude: currentlySelectedLocation?.lon ?? 90.421824,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsPointsOfInterest={false}
          onMapReady={_onMapReady}
        >
          {branches.map((branch) => {
            const id = branch.data.id;
            const name = branch.data.name;
            const logoImageURI = branch.restaurant?.data?.logoImageURI ?? "";
            const location = branch.data.location;

            return (
              <BranchMarker
                key={id}
                location={location}
                name={name}
                logoImageURI={logoImageURI}
                onGetDirection={() => openDirection(location)}
              />
            );
          })}
        </MapView>

        <Box position="absolute" m="screen">
          <Pressable onPress={() => navigation.goBack()}>
            <CircularIcon
              name="arrow-left"
              color="#000"
              backgroundColor="#fff"
              size={54}
            />
          </Pressable>
        </Box>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box padding="screen">
          <Box style={{ marginTop: 27 }}>
            <Text style={styles.title}>Nearby</Text>
            {nearbyBranches.map((branch) => {
              const id = branch.data.id;
              const logoImageURI = branch.restaurant?.data.logoImageURI ?? "";
              const name = branch.data.name;
              const address = branch.data.address;
              const location = branch.data.location;
              return (
                <Store
                  key={id}
                  logoImageURI={logoImageURI}
                  name={name}
                  address={address}
                  location={location}
                  onGetDirections={() => openDirection(location)}
                  onDialCall={() => dialCall(branch.restaurant?.data.phone)}
                />
              );
            })}
          </Box>

          <Box style={{ marginTop: 60 }}>
            <Text style={styles.title}>Other Locations</Text>
            {branches.map((branch) => {
              const id = branch.data.id;
              const logoImageURI = branch.restaurant?.data.logoImageURI ?? "";
              const name = branch.data.name;
              const address = branch.data.address;
              const location = branch.data.location;
              return (
                <Store
                  key={id}
                  logoImageURI={logoImageURI}
                  name={name}
                  address={address}
                  location={location}
                  onGetDirections={() => openDirection(location)}
                  onDialCall={() => dialCall(branch.restaurant?.data.phone)}
                />
              );
            })}
          </Box>
        </Box>
      </ScrollView>
    </SafeArea>
  );
});

const useStyles = makeStyles(() => ({
  mapContainer: {
    height,
    width,
    position: "relative",
  },
  map: {
    height,
    width,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
}));

export default StoreLocator;
