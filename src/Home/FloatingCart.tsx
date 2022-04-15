import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { observer } from "mobx-react";

import { Box, Icon, Text } from "../components";
import { useAppState } from "../state/StateContext";
import type { CartableWrapper, CartStore } from "../state/store/CartStore";
import type { RootStackProps } from "../components/AppNavigator";

interface FloatingCartProps {
  insetBottom?: boolean;
}

const FloatingCart = observer(({ insetBottom = false }: FloatingCartProps) => {
  const navigation = useNavigation<RootStackProps<"HomeStack">["navigation"]>();

  const insets = useSafeAreaInsets();

  const cart: CartStore = useAppState("cart");
  const cartItems: CartableWrapper[] = cart.all;

  if (cartItems.length === 0) return null;

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("HomeStack", { screen: "Cart" })}
    >
      <Box
        m="m"
        position="absolute"
        bottom={insetBottom ? insets.bottom : 0}
        left={0}
        right={0}
        style={{ zIndex: 2 }}
      >
        <Box
          height={57}
          backgroundColor="primary"
          borderRadius="l"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          style={{ paddingHorizontal: 26 }}
        >
          <Box
            flexDirection="row"
            alignItems="center"
            flexGrow={1}
            flexShrink={0}
            flexBasis={0}
          >
            <Icon name="shopping-cart" size={24} color="#fff" />

            <Box
              width={24}
              height={24}
              borderWidth={2}
              borderColor="background"
              borderRadius="l"
              alignItems="center"
              justifyContent="center"
              style={{ marginLeft: 8 }}
            >
              <Text fontSize={12} fontFamily="Normal" color="background">
                {cartItems.length}
              </Text>
            </Box>

            <Box
              width={1}
              height={28}
              backgroundColor="background"
              style={{ marginLeft: 8 }}
            />
          </Box>

          <Text fontSize={17} color="background" fontFamily="Normal">
            View your cart
          </Text>

          <Box flexGrow={1} flexShrink={0} flexBasis={0} alignItems="flex-end">
            <Text fontSize={17} color="background" fontFamily="Normal">
              ৳ {cart.grandTotalAmount.toLocaleString("en-IN")}
            </Text>
          </Box>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
});

export default FloatingCart;
