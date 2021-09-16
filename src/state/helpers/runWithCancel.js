export function runWithCancel(func, ...args) {
    const gen = func(...args);

    let cancelled, cancel;

    const promise = new Promise((resolve, reject) => {
        cancel = (data = {reason: 'TIMEOUT'}) => {
            cancelled = true;
            reject(data);
        };

        function onFulfilled(res) {
            if (!cancelled) {
                let result;

                try {
                    result = gen.next(res);
                } catch (e) {
                    return reject(e);
                }

                next(result);

                return null;
            }
        }

        function onRejected(err) {
            let result;

            try {
                result = gen.throw(err);
            } catch (e) {
                return reject(e);
            }

            next(result);
        }

        function next({done, value}) {
            if (done) {
                return resolve(value);
            }

            return value.then(onFulfilled, onRejected);
        }

        onFulfilled();
    });

    return {promise, cancel};
}
