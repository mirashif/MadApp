import {useAppState} from '../StateContext';
import {computed} from 'mobx';

export function useStory(id: string) {
    const stories = useAppState('stories');
    const story = computed(() => stories.get(id)).get();

    return {
        story: story,
    };
}
