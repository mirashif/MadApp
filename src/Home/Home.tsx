import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { observer } from "mobx-react";
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
import type { LockedAddressStore } from "../state/store/LockedAddressStore";

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
  const lockedAddress: LockedAddressStore = useAppState("lockedAddress");
  const restaurants: RestaurantStore = useAppState("restaurants");
  const userStore: UserStore = useAppState("user");

  const address = lockedAddress.lockedAddress;
  const isLoggedIn = auth.authenticated;
  const restaurantList: Restaurant[] = restaurants.all;
  const user = userStore.user;

  const [itemBuilderId, setItemBuilderId] = useState<string | null>(null);
  const [addressListModalVisible, setAddressListModalVisible] = useState(false);

  const handleLocationEdit = () => {
    setAddressListModalVisible(true);
  };

  /*
   * requiring user info
   */
  useEffect(() => {
    if (!user) return;
    const userData = user.firstName && user.lastName;
    if (!userData) {
      setTimeout(() => {
        navigation.navigate("OnBoarding", {
          step: OnBoardingSteps.USER_INFO,
        });
      }, 1000);
    }
  }, [user, navigation, isFocused]);

  /*
   * requiring location data
   */
  useEffect(() => {
    const userData = user && user.firstName && user.lastName;
    if (userData && !address) {
      setTimeout(() => {
        handleLocationEdit();
      }, 1000);
    }
  }, [address, isLoggedIn, isFocused, user]);

  return (
    <SafeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LocationBar onEditPress={handleLocationEdit} />
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
