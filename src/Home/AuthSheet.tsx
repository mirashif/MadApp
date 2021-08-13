import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Box, Text, Button } from "../components";

const AuthSheet = () => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const authSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    authSheetRef.current?.present();
  }, []);

  return (
    <BottomSheetModal
      ref={authSheetRef}
      snapPoints={[185 + insets.bottom]}
      dismissOnPanDown={false}
      handleComponent={null}
      enableOverDrag={false}
      backdropComponent={() => (
        <Box
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.17)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
    >
      <Box style={{ margin: 30 }}>
        <Text fontSize={24} fontFamily="Bold" mb="m">
          Sign up or login
        </Text>

        <Button
          variant="outlined"
          size="xl"
          onPress={() => {
            authSheetRef.current?.close();
            navigation.navigate("AuthStack");
          }}
        >
          Continue with phone
        </Button>

        <Text fontSize={12} fontFamily="Normal" mt="m">
          By signing up you agree to our{" "}
          <Text fontFamily="Bold" color="primary">
            Terms & Conditions
          </Text>{" "}
          and{" "}
          <Text fontFamily="Bold" color="primary">
            Privacy Policy
          </Text>
        </Text>
      </Box>
    </BottomSheetModal>
  );
};

export default AuthSheet;
