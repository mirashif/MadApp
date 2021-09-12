import { flowResult } from "mobx";
import type { CancellablePromise } from "mobx/dist/api/flow";

import { toGenerator } from "./toGenerator";

export function composeFlow<R>(
  flow: Generator<any, R, any> | CancellablePromise<R> | Promise<R>
) {
  if (flow instanceof Promise && !("cancel" in flow)) {
    return toGenerator(flow);
  }

  return toGenerator(flowResult(flow));
}
