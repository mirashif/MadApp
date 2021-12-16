import {useAppState} from '../StateContext';

export function useBranches() {
    const branches = useAppState('branches');

    return {
        branches: branches.all,
        availableBranches: branches.availableBranches,
    };
}
