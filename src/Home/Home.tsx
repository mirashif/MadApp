import { useIsFocused } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { ScrollView } from "react-native";

import { SafeArea, Text } from "../components";
import { useCart } from "../state/hooks/useCart";
import { useAppState } from "../state/StateContext";
import type { AuthStore } from "../state/store/AuthStore";
import type {
  Restaurant,
  RestaurantStore,
} from "../state/store/RestaurantStore";

import AddressListModal from "./AddressListModal";
import AuthSheet from "./AuthSheet";
import BannerCarousel from "./BannerCarousel";
import FloatingCart from "./FloatingCart";
import HomeRestaurant from "./HomeRestaurant";
import ItemBottomSheet from "./ItemBottomSheet/ItemBottomSheet";
import LocationBar from "./LocationBar";
import Stories from "./Stories";

const Home = observer(() => {
  const isFocused = useIsFocused();

  const auth: AuthStore = useAppState("auth");
  const restaurants: RestaurantStore = useAppState("restaurants");

  const isLoggedIn = auth.authenticated;
  const restaurantList: Restaurant[] = restaurants.all;
  const { length: cartItemCount } = useCart();

  const [bottomSheetItemId, setBottomSheetItemId] = useState<string | null>(
    null
  );
  const [addressListModalVisible, setAddressListModalVisible] = useState(false);

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LocationBar
          onEditPress={() => {
            setAddressListModalVisible(true);
          }}
        />
        <BannerCarousel />
        <Stories />
        {restaurantList && (
          <>
            <Text mb="l" mx="screen" variant="sectionTitle">
              🍴 Restaurants
            </Text>
            {restaurantList.map((restaurant) => (
              <HomeRestaurant
                key={restaurant.id}
                restaurant={restaurant.data}
                onItemPress={(itemId) => {
                  setBottomSheetItemId(itemId);
                }}
                items={restaurant.popularItems}
              />
            ))}
          </>
        )}
      </ScrollView>

      {cartItemCount > 0 && <FloatingCart />}

      {isFocused && !isLoggedIn && <AuthSheet />}

      <AddressListModal
        visible={addressListModalVisible}
        onClose={() => setAddressListModalVisible(false)}
      />

      <ItemBottomSheet
        {...{
          bottomSheetItemId,
          setBottomSheetItemId,
        }}
      />
    </SafeArea>
  );
});

export default Home;
