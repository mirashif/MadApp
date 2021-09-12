import { computed } from "mobx";

import { useAppState } from "../StateContext";

export function useStory(id: string) {
  const stories = useAppState("stories");
  const story = computed(() => stories.get(id)).get();

  return {
    story: story,
  };
}
