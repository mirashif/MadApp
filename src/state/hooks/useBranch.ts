import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useBranch(id: string) {
    const branches = useAppState('branches');
    const branch = computed(() => branches.get(id)).get();

    return {
        branch,
    };
}
