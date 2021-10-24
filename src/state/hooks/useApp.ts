import {useAppState} from '../StateContext';

export function useApp() {
    const app = useAppState('app');

    return {
        get globals() {
            return app?.globals;
        },
    };
}
