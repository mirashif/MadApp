import {useAppState} from '../StateContext';
import {useMemo} from 'react';
import {computed} from 'mobx';
import {useAddressBuilder} from './useAddressBuilder';

export function useAddress(id: string) {
    const addresses = useAppState('addresses');
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
