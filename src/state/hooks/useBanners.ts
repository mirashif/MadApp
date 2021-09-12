import { useAppState } from "../StateContext";

export function useBanners() {
  const banners = useAppState("banners");

  return {
    banners: banners.all,
  };
}
