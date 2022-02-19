import { useIsFocused } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { ScrollView } from "react-native";

import { FloatingAreaSpace, SafeArea, Text } from "../components";
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
import { ItemBuilder } from "./ItemBuilder";
import LocationBar from "./LocationBar";
import RestaurantMenu from "./RestaurantMenu";
import Stories from "./Stories";

const Home = observer(() => {
  const isFocused = useIsFocused();

  const auth: AuthStore = useAppState("auth");
  const restaurants: RestaurantStore = useAppState("restaurants");

  const isLoggedIn = auth.authenticated;
  const restaurantList: Restaurant[] = restaurants.all;

  const [itemBuilderId, setItemBuilderId] = useState<string | null>(null);
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
              <RestaurantMenu
                key={restaurant.id}
                restaurant={restaurant.data}
                onItemPress={(itemId) => {
                  setItemBuilderId(itemId);
                }}
                items={restaurant.popularItems}
              />
            ))}
          </>
        )}

        <FloatingAreaSpace />
      </ScrollView>

      <FloatingCart />

      {isFocused && !isLoggedIn && <AuthSheet />}

      <AddressListModal
        visible={addressListModalVisible}
        onClose={() => setAddressListModalVisible(false)}
      />

      <ItemBuilder
        {...{
          itemBuilderId,
          setItemBuilderId,
        }}
      />
    </SafeArea>
  );
});

export default Home;
