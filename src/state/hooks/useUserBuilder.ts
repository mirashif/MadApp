import {useAppState} from '../StateContext';
import {useEffect, useMemo} from 'react';
import {UserBuilder} from '../store/UserBuilder';

export function useUserBuilder() {
    const store = useAppState();
    const user = store.user;
    const data = user.user;

    const builder = useMemo(() => {
        if (data) {
            return new UserBuilder(store, data);
        }

        return null;
    }, [store, data]);

    return {
        ready: !!builder,
        setFirstName: builder?.setFirstName,
        setLastName: builder?.setLastName,
        setDob: builder?.setDob,
        setEmail: builder?.setEmail,
        get firstName() {
            return builder?.firstName;
        },
        get lastName() {
            return builder?.lastName;
        },
        get dob() {
            return builder?.dob;
        },
        get email() {
            return builder?.email;
        },
        get phone() {
            return builder?.phone;
        },
        userable() {
            return builder?.userable;
        },
    };
}
