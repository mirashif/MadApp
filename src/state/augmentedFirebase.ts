import originalAuth from '@react-native-firebase/auth';
import originalFirestore from '@react-native-firebase/firestore';
import originalFunctions from '@react-native-firebase/functions';
import originalStorage from '@react-native-firebase/storage';
import {Platform} from 'react-native';

let initialized = false;

export interface AugmentedFirebaseType {
    auth: () => ReturnType<typeof originalAuth>;
    firestore: () => ReturnType<typeof originalFirestore>;
    functions: () => ReturnType<typeof originalFunctions>;
    storage: () => ReturnType<typeof originalStorage>;
}

export async function augmentedFirebase(): Promise<AugmentedFirebaseType> {
    if (!initialized) {
        if (__DEV__) {
            const host =
                process.env.FIRE_EMULATOR_HOST ||
                (Platform.OS === 'ios' ? 'localhost' : '0.0.0.0');

            const firestorePort =
                parseInt(`${process.env.FIRE_FIRESTORE_PORT}`, 10) || 8080;

            const functionsPort =
                parseInt(`${process.env.FIRE_FIRESTORE_PORT}`, 10) || 5001;

            const authPort =
                parseInt(`${process.env.FIRE_FIRESTORE_PORT}`, 10) || 9099;

            const storagePort =
                parseInt(`${process.env.FIRE_FIRESTORE_PORT}`, 10) || 9199;

            console.log('FIREBASE: FAKED', host);

            originalFirestore().useEmulator(`${host}`, firestorePort);

            await originalFirestore().settings({
                cacheSizeBytes: originalFirestore.CACHE_SIZE_UNLIMITED,
            });

            originalFunctions().useFunctionsEmulator(
                `http://${host}:${functionsPort}`,
            );
            originalAuth().useEmulator(`http://${host}:${authPort}`);
            originalStorage().useEmulator(host, storagePort);

            await new Promise((accept) => setTimeout(accept, 500));
        }

        initialized = true;
    }

    return {
        auth: () => originalAuth(),
        firestore: () => originalFirestore(),
        functions: () => originalFunctions(),
        storage: () => originalStorage(),
    };
}
