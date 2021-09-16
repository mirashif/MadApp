type ArgTypes<T> = T extends (...a: infer A) => unknown ? A : [];
type CleanUpFunctionType = () => void;

export function withCleanup<
    FUNC extends (...args: unknown[]) => CleanUpFunctionType | void,
>(func: FUNC): (...args: ArgTypes<FUNC>) => void {
    let cleanup: CleanUpFunctionType | void;

    return (...args) => {
        if (typeof cleanup === 'function') {
            cleanup();
        }

        cleanup = func(...args);
    };
}
