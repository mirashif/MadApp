import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useInvite(id: string) {
    const invites = useAppState('invites');
    const invite = computed(() => invites.get(id)).get();

    return {
        invite: invite,
    };
}
