import type { LocationGeocodedAddress } from "expo-location";

export { default as EditLocation } from "./EditLocation";

export const getFormattedAddress = (
  address: LocationGeocodedAddress | null
): string => {
  if (!address) return "";
  const { name, street, city } = address;
  if (name && !name.includes("+"))
    if (street) return `${name}, ${street}`;
    else return name;
  else if (street) return street;
  else if (city) return city;
  else return "";
};
