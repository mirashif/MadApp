import {useAppState} from '../StateContext';

export function useLockedAddress() {
    const lockedAddress = useAppState('lockedAddress');

    return {
        lockedAddress: lockedAddress.lockedAddress,
        lockAddress: lockedAddress.lockAddress,
    };
}
