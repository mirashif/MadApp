import { useEffect, useState } from "react";

export function useTicker(millis = 1000, run = true): void {
  const [_, set_] = useState(false);

  useEffect(() => {
    if (run) {
      const to = setTimeout(() => set_((_) => !_), millis);
      return () => clearTimeout(to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, _]);
}
