import {useAppState} from '../StateContext';

export function useAddresses() {
    const addresses = useAppState('addresses');

    return {
        get addresses() {
            return addresses.all;
        },
        get locationAddress() {
            return addresses.locationAddress;
        },
        setLocation: addresses.setLocation,
        get closestAddress() {
            return addresses.closestAddress;
        },
        get defaultAddress() {
            return addresses.defaultAddress;
        },
        addAddress: addresses.addAddress,
    };
}
