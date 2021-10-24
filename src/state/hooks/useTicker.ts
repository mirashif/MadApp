import {useEffect, useState} from 'react';

export function useTicker(millis: number = 1000, run: boolean = true): void {
    const [_, set_] = useState(false);

    useEffect(() => {
        if (run) {
            const to = setTimeout(() => set_((_) => !_), millis);
            return () => clearTimeout(to);
        }
    }, [run, _]);
}
