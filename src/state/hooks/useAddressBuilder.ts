import {useAppState} from '../StateContext';
import {useEffect, useMemo} from 'react';
import {AddressBuilder} from '../store/AddressBuilder';
import {addressBuilderReactions} from '../reactions/addressBuilder';
import {computed} from 'mobx';

export function useAddressBuilder(id: string | null = null) {
    const store = useAppState();
    const addresses = store.addresses;
    const address = computed(() => (id ? addresses.get(id) : null)).get();

    const builder = useMemo(() => {
        if (id) {
            if (address) {
                return new AddressBuilder(store, address);
            } else {
                return null;
            }
        } else {
            return new AddressBuilder(store);
        }
    }, [id, address, store]);

    useEffect(() => {
        if (builder) {
            addressBuilderReactions(builder);
        }
    }, [builder]);

    return {
        get address() {
            return builder?.address;
        },
        get location() {
            return builder?.location;
        },
        get label() {
            return builder?.label;
        },
        get directions() {
            return builder?.directions;
        },
        get isAddressInferred() {
            return builder?.isAddressInferred;
        },
        get isAddressInferring() {
            return builder?.isAddressInferring;
        },
        get isLocationInferred() {
            return builder?.isLocationInferred;
        },
        get isLocationInferring() {
            return builder?.isLocationInferring;
        },
        get addressable() {
            return builder?.addressable;
        },
        setAddress: builder?.setAddress,
        setLocation: builder?.setLocation,
        setDirections: builder?.setDirections,
        setLabel: builder?.setLabel,
        ready: !!builder,
    };
}
