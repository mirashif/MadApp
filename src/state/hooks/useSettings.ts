import {useAppState} from '../StateContext';

export function useSettings() {
    const user = useAppState('user');

    return {
        settings: user.settings,
        updateSettings: user.updateSettings,
    };
}
