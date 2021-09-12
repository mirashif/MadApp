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
      console.log("FIREBASE: FAKED");

      await originalFirestore().settings({
        cacheSizeBytes: originalFirestore.CACHE_SIZE_UNLIMITED,
      });

      originalFirestore().useEmulator("localhost", 8080);
      originalFunctions().useFunctionsEmulator("http://localhost:5001");
      originalAuth().useEmulator("http://localhost:9099");

      await new Promise((accept) => setTimeout(accept, 2000));
    }

    initialized = true;
  }

  return {
    auth: () => originalAuth(),
    firestore: () => originalFirestore(),
    functions: () => originalFunctions(),
  };
}
