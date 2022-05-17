import { useIsFocused } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import { OnBoardingSteps } from "../Auth";
import { FloatingAreaSpace, SafeArea, Text } from "../components";
import type { RootStackProps } from "../components/AppNavigator";
import { useAppState } from "../state/StateContext";
import type { AuthStore } from "../state/store/AuthStore";
import type {
  Restaurant,
  RestaurantStore,
} from "../state/store/RestaurantStore";
import type { UserStore } from "../state/store/UserStore";

import AddressListModal from "./AddressListModal";
import AuthSheet from "./AuthSheet";
import BannerCarousel from "./BannerCarousel";
import FloatingCart from "./FloatingCart";
import { ItemBuilder } from "./ItemBuilder";
import LocationBar from "./LocationBar";
import RestaurantMenu from "./RestaurantMenu";
import Stories from "./Stories";

const Home = observer(({ navigation }: RootStackProps<"HomeStack">) => {
  const isFocused = useIsFocused();

  const auth: AuthStore = useAppState("auth");
  const restaurants: RestaurantStore = useAppState("restaurants");
  const userStore: UserStore = useAppState("user");

  const addresses = useAppState("addresses");
  const lockedAddress = useAppState("lockedAddress");

  const user = userStore.user;

  const isLoggedIn = auth.authenticated;
  const restaurantList: Restaurant[] = restaurants.all;

  const [itemBuilderId, setItemBuilderId] = useState<string | null>(null);
  const [addressListModalVisible, setAddressListModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      if (!user.firstName || !user.lastName) {
        setTimeout(() => {
          navigation.navigate("OnBoarding", {
            step: OnBoardingSteps.USER_INFO,
          });
        }, 100);
      }
    }
  }, [user, navigation, isFocused]);

  useEffect(() => {
    if (
      !lockedAddress.lockedAddress &&
      user?.firstName &&
      user?.lastName &&
      !addressListModalVisible
    ) {
      setImmediate(() => {
        setAddressListModalVisible(true);
      });
    }
  }, [
    user,
    addresses.all,
    lockedAddress.lockedAddress,
    addressListModalVisible,
  ]);

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
