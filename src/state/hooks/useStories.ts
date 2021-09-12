import { useAppState } from "../StateContext";

export function useStories() {
  const stories = useAppState("stories");

  return {
    stories: stories.all,
  };
}
