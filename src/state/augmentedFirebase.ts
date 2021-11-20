import originalAuth from "@react-native-firebase/auth";
import originalFirestore from "@react-native-firebase/firestore";
import originalFunctions from "@react-native-firebase/functions";

let initialized = false;

export interface AugmentedFirebaseType {
  auth: () => ReturnType<typeof originalAuth>;
  firestore: () => ReturnType<typeof originalFirestore>;
  functions: () => ReturnType<typeof originalFunctions>;
}

export async function augmentedFirebase(): Promise<AugmentedFirebaseType> {
  if (!initialized) {
    if (__DEV__) {
      const host = process.env.FIRE_EMULATOR_HOST || "localhost";

      const firestorePort =
        parseInt(`${process.env.FIRE_FIRESTORE_PORT}`) || 8080;

      const functionsPort =
        parseInt(`${process.env.FIRE_FIRESTORE_PORT}`) || 5001;

      const authPort = parseInt(`${process.env.FIRE_FIRESTORE_PORT}`) || 9099;

      console.log("FIREBASE: FAKED", host);

      originalFirestore().useEmulator(`${host}`, firestorePort);

      await originalFirestore().settings({
        cacheSizeBytes: originalFirestore.CACHE_SIZE_UNLIMITED,
      });

      originalFunctions().useFunctionsEmulator(
        `http://${host}:${functionsPort}`
      );
      originalAuth().useEmulator(`http://${host}:${authPort}`);

      await new Promise((accept) => setTimeout(accept, 500));
    }

    initialized = true;
  }

  return {
    auth: () => originalAuth(),
    firestore: () => originalFirestore(),
    functions: () => originalFunctions(),
  };
}
