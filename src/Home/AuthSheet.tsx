import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { Box, Text, Button } from "../components";

const AuthSheet = () => {
  const navigation = useNavigation();

  const authSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    authSheetRef.current?.present();
  }, []);

  return (
    <BottomSheetModal
      ref={authSheetRef}
      snapPoints={[210]}
      enableDismissOnClose={false}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      enableOverDrag={false}
      handleComponent={null}
      backdropComponent={() => (
        <Box
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.17)",
            ...StyleSheet.absoluteFillObject,
          }}
        />
      )}
    >
      <Box
        style={{
          margin: 30,
        }}
      >
        <Text fontSize={24} fontFamily="Bold" mb="m">
          Sign up or login
        </Text>

        <Button
          variant="outlined"
          size="xl"
          onPress={() => {
            authSheetRef.current?.close();
            navigation.navigate("AuthStack", { screen: "MobileNumber" });
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
