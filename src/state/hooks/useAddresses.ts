import { useAppState } from "../StateContext";

export function useAddresses() {
  const addresses = useAppState("addresses");

  return {
    addresses: addresses.all,
    locationAddress: addresses.locationAddress,
    setLocation: addresses.setLocation,
    closestAddress: addresses.closestAddress,
    addAddress: addresses.addAddress,
  };
}
