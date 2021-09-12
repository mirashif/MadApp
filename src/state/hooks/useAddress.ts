import { useMemo } from "react";
import { computed } from "mobx";

import { useAppState } from "../StateContext";

import { useAddressBuilder } from "./useAddressBuilder";

export function useAddress(id: string) {
  const addresses = useAppState("addresses");
  const address = computed(() => addresses.get(id)).get();

  const updateAddress = useMemo(() => {
    return addresses.updateAddress.bind(addresses, id);
  }, [id, addresses]);

  const deleteAddress = useMemo(() => {
    return addresses.deleteAddress.bind(addresses, id);
  }, [id, addresses]);

  const useBuilder = useMemo(() => {
    return () => {
      if (!id) {
        return null;
      }

      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useAddressBuilder(id);
    };
  }, [id]);

  return {
    address,
    updateAddress,
    deleteAddress,
    useBuilder,
  };
}
