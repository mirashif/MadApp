const measurements: {
    [key: string]: number[];
} = {};

export function profile(key: string) {
    // if (!(key in measurements)) {
    //     measurements[key] = [];
    // }

    // measurements[key].push(global.performance.now());
    // const i = measurements[key].length - 1;

    function closeProfile(): void;
    function closeProfile<VAL>(val?: VAL): VAL;
    function closeProfile<VAL>(val?: VAL): VAL | void {
        // measurements[key][i] = global.performance.now() - measurements[key][i];
        return val;
    }

    return closeProfile;
}

// setInterval(() => {
//     const funcs = [];
//
//     for (const key in measurements) {
//         const ms = measurements[key];
//
//         let called = 0;
//         let unClosed = 0;
//         let sum = 0;
//
//         for (const time of ms) {
//             called++;
//
//             if (time >= 30 * 60 * 300) {
//                 unClosed++;
//             } else {
//                 sum += time;
//             }
//         }
//
//         funcs.push({
//             key,
//             called,
//             unClosed,
//             sum,
//             average: sum / (called - unClosed),
//         });
//     }
//
//     console.log(`NAME\tCALLED\tSUM\tAVERAGE\tUNCLOSED`);
//
//     funcs
//         .sort((a, b) => b.called - a.called)
//         .forEach((func) =>
//             console.log(
//                 `${func.key}\t${func.called}\t${func.sum}\t${func.average}\t${func.unClosed}`,
//             ),
//         );
//
//     console.log(`\n\n\n\n`);
// }, 30 * 1000);
