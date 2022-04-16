import {toGenerator} from './toGenerator';
import {flowResult} from 'mobx';
import {CancellablePromise} from 'mobx/dist/api/flow';

export function composeFlow<R>(
    flow: Generator<any, R, any> | CancellablePromise<R> | Promise<R>,
) {
    if (flow instanceof Promise && !('cancel' in flow)) {
        return toGenerator(flow);
    }

    return toGenerator(flowResult(flow));
}
