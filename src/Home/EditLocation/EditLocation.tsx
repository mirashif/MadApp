import React, { useEffect, useMemo } from "react";
import { Dimensions, ScrollView } from "react-native";
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
import Label from "./Label";

const { height: windowHeight, width } = Dimensions.get("window");
const height = windowHeight * 0.4;
const INFERRING_DELAY = 1000;

const EditLocation = observer(() => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RootStackProps<"EditLocation">["route"]>();
  const { id } = route?.params;

  const addresses: AddressStore = useAppState("addresses");

  const address: Address | null = useMemo(() => {
    if (id !== "location" || null) return addresses.get(id as string);
    else return null;
  }, [addresses, id]);

  const builder: AddressBuilder = useMemo(() => {
    if (id === "location" || null) {
      // Fresh Builder (for new addresses)
      return addresses.builder;
    } else {
      // Pre-populated Builder (for address editing)
      const _address = addresses.get(id as string);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return _address!.builder;
    }
  }, [addresses, id]);

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

  return (
    <SafeArea>
      <DissmissKeyboard>
        <Box style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: builder.location?.lat ?? 0,
              longitude: builder.location?.lon ?? 0,
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
                setTimeout(
                  () => builder.setAddress(_address as string),
                  INFERRING_DELAY
                )
              }
              inputProps={{
                editable: builder.isAddressInferring,
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
                setTimeout(
                  () => builder.setDirections(_directions as string),
                  INFERRING_DELAY
                )
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
              value={builder.label || "Other"}
              onLabelChange={(_label) => builder.setLabel(_label as string)}
            />
            <Button
              onPress={handleSaveAddress}
              size="lg"
              style={{
                marginBottom: 16,
              }}
            >
              Save
            </Button>
            <Button
              onPress={handleDeleteAddress}
              size="lg"
              variant="outlined"
              style={{
                marginBottom: insets.bottom,
              }}
            >
              Delete
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
