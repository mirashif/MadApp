import React, { useEffect, useMemo, useState } from "react";
import { Alert, Dimensions, ScrollView } from "react-native";
import type { Region } from "react-native-maps";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { observer } from "mobx-react";

import { SafeArea, Box, makeStyles, Text, Button } from "../../components";
import Input from "../../components/Input";
import DissmissKeyboard from "../../components/DissmissKeyboard";
import type { Address, AddressStore } from "../../state/store/AddressStore";
import { useAppState } from "../../state/StateContext";
import type { AddressBuilder } from "../../state/store/AddressBuilder";
import type { RootStackProps } from "../../components/AppNavigator";

import MarkerIcon from "./assets/marker.svg";
import Label, { LabelEnum } from "./Label";

const { height: windowHeight, width } = Dimensions.get("window");
const height = windowHeight * 0.4;

interface Coords {
  latitude: number;
  longitude: number;
}

const EditLocation = observer(() => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RootStackProps<"EditLocation">["route"]>();
  const { id } = route?.params;

  const addresses: AddressStore = useAppState("addresses");

  const builder: AddressBuilder = useMemo(() => {
    if (id === "location" || null) {
      // editing unsaved current location
      // Fresh Builder (for new addresses)
      return addresses.builder;
    } else {
      // editing existing address
      // Pre-populated Builder (for address editing)
      const addressList: Address[] = addresses.all;
      const address = addressList.find(
        ({ data: _address }) => _address.id === id
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return address!.builder;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // // # Fresh Builder (for new addresses)
  // const builder: AddressBuilder = addresses.builder;

  // // # Pre-populated Builder (for address editing)
  // const address: Address = addresses.all[i];
  // const builder: AddressBuilder = address.builder;

  const [region, setRegion] = useState<Region>();
  const [displayAddress, setDisplayAddress] = useState("");
  const [label, setLabel] = useState<LabelEnum | string>(LabelEnum.HOME);

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
    console.log("params", route.params);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfLocationEnabled = async () => {
    const enabled = await Location.hasServicesEnabledAsync();

    // TODO: remove alert
    if (!enabled)
      Alert.alert(
        "Location Service not enabled",
        "Please enable your location services to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );

    // Location service enabled
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    // TODO: remove alert
    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    const { coords } = await Location.getCurrentPositionAsync();

    if (coords) resolveDisplayAddress(coords);
  };

  const resolveDisplayAddress = async (coords: Coords) => {
    const { latitude, longitude } = coords;
    const response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    for (const item of response) {
      const address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;

      setDisplayAddress(address);

      if (address.length > 0) return;
    }
  };

  const handleRegionChangeComplete = (_region: Region) => {
    setRegion(_region);
    resolveDisplayAddress(_region);
  };

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
            onRegionChangeComplete={handleRegionChangeComplete}
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
              onChangeText={() => null}
              label="Address"
              placeholder="26, Block B, Lalmatia"
              value={displayAddress}
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
              // TODO: add save fn
              onPress={() => undefined}
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
