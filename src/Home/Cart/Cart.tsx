import React, { useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { observer } from "mobx-react";

import {
  Box,
  CustomModal,
  HeaderBar,
  makeStyles,
  SafeArea,
  Text,
  useTheme,
} from "../../components";
import LocationBar from "../LocationBar";
import Input from "../../components/Input";
import type { HomeStackProps } from "..";
import { useCart } from "../../state/hooks/useCart";

import OrderItem from "./OrderItem";
import PopularItem from "./PopularItem";
import { VoucherButton, ClearCartButton, CheckoutButton } from "./Button";
import OrderSummaryItem, { Discount } from "./Item";
import VoucherIllustration from "./assets/VoucherIllustration.svg";

const orderItems = [
  {
    id: "1",
    name: "SMG Pizza",
    addons:
      "Cheese, Extra Mushroom, Tomato, Samosa, Black Pepper, Sand Paper, Taylor Swift, Jalapenos, Blue Cheese",
    price: 669,
    image: "https://source.unsplash.com/MqT0asuoIcU/114x114/",
    quantity: 100,
  },
  {
    id: "2",
    name: "SMG Pizza",
    addons: "Permission Cheese",
    price: 669,
    image: "https://source.unsplash.com/MqT0asuoIcU/114x114/",
    quantity: 1,
  },
];

const popularItems = [...Array(6)].map((_, id) => {
  return {
    id,
    image: "https://source.unsplash.com/collection/8592813/82x82",
    name: "Burnt Cheezcake",
    category: "Dessert",
    currentPrice: 350,
    oldPrice: 399,
  };
});

const Cart = observer(({ navigation }: HomeStackProps<"Cart">) => {
  const theme = useTheme();
  const styles = useStyles();

  const insets = useSafeAreaInsets();

  const windowWidth = Dimensions.get("window").width;

  const { receipt } = useCart();

  const [modalVisible, setModalVisible] = useState(false);
  const [tempVoucher, setTempVoucher] = useState<null | string>(null);
  const [voucher, setVoucher] = useState<null | string>(null);
  const [wrongVoucher, setWrongVoucher] = useState(false);

  const handleVoucher = () => {
    if (wrongVoucher) {
      setWrongVoucher(false);
      return;
    }

    if (tempVoucher?.toLocaleLowerCase() === "zanvent") {
      setVoucher(tempVoucher);
      setModalVisible(false);
      return;
    }

    setWrongVoucher(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setWrongVoucher(false);
  };

  return (
    <SafeArea>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 + insets.bottom }}
      >
        <HeaderBar title="Cart" />

        <Box mx="screen">
          <LocationBar editMode onEditPress={() => null} />
        </Box>

        {/*Order Items*/}
        <Box px={"screen"}>
          <Box style={{ marginTop: 33 }}>
            <Text style={styles.sectionTitle}>Order Details</Text>

            {orderItems.map((item) => (
              <OrderItem
                key={item.id}
                {...{ ...item }}
                onDelete={() => null}
                onDecrease={() => null}
                onIncrease={() => null}
              />
            ))}

            <Box mt="s">
              <ClearCartButton onPress={() => null} />
            </Box>
          </Box>
        </Box>

        {/*Popular Orders*/}
        <Box style={{ marginTop: 40 }}>
          <Box px="screen">
            <Text style={styles.sectionTitle}>Popular with your order</Text>
          </Box>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.screen,
            }}
          >
            {popularItems.map((item) => (
              <PopularItem key={item.id} {...{ ...item }} onAdd={() => null} />
            ))}
          </ScrollView>
        </Box>

        {/*Order Summary & Voucher*/}
        <Box style={{ marginTop: 83, paddingHorizontal: 40 }}>
          <OrderSummaryItem
            title="Subtotal"
            description={`৳${receipt.subtotal}`}
          />
          <OrderSummaryItem
            title="Delivery fee"
            description={`৳${receipt.deliveryCharge}`}
          />

          <Box mt="m">
            {voucher && (
              <Discount
                amount={receipt.discount}
                onDiscountCancel={() => setVoucher(null)}
              />
            )}

            {!voucher && (
              <VoucherButton onPress={() => setModalVisible(true)} />
            )}
          </Box>
        </Box>
      </ScrollView>

      {/*Total & Checkout*/}
      <Box
        position="absolute"
        bottom={0}
        width={windowWidth}
        backgroundColor="background"
        style={{ paddingTop: 22, paddingBottom: 16 + insets.bottom }}
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ paddingHorizontal: 40 }}
        >
          <Box>
            <Text style={{ fontSize: 18 }}>Total</Text>
            <Text style={{ color: "#BBBBBB", fontSize: 11 }}>VAT included</Text>
          </Box>

          <Text style={{ fontSize: 18 }}>৳{receipt.total}</Text>
        </Box>

        <Box style={{ alignItems: "center", marginTop: 27 }}>
          <CheckoutButton onPress={() => navigation.navigate("Checkout")} />
        </Box>
      </Box>

      <CustomModal
        visible={modalVisible}
        onRequestClose={handleModalClose}
        onBackPress={handleModalClose}
        buttonTitle={wrongVoucher ? "Try Again" : "Apply"}
        onButtonPress={handleVoucher}
        title={wrongVoucher ? "Uh Oh!" : ""}
      >
        {wrongVoucher && (
          <>
            <Text fontSize={15} style={{ marginTop: 29, marginBottom: 35 }}>
              The minimum order value for this voucher is ৳130.00 {"\n\n"}{" "}
              Please add ৳23.00 more to use this voucher
            </Text>
          </>
        )}

        {!wrongVoucher && (
          <>
            <Box alignItems="center">
              <VoucherIllustration />
            </Box>

            <Box my="m">
              <Input
                placeholder="Enter Your Voucher Code"
                onChangeText={(value) => setTempVoucher(value)}
              />
            </Box>
          </>
        )}
      </CustomModal>
    </SafeArea>
  );
});

const useStyles = makeStyles(() => ({
  sectionTitle: {
    color: "#8A8A8A",
    fontSize: 18,
    marginBottom: 21,
  },
}));

export default Cart;
