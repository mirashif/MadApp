import { makeAutoObservable } from "mobx";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import type { AugmentedFirebaseType } from "../augmentedFirebase";

import { AuthStore } from "./AuthStore";
import { UserStore } from "./UserStore";
import { ReferralValidator } from "./ReferralValidator";
import { BannerStore } from "./BannerStore";
import { StoryStore } from "./StoryStore";
import { LockedAddressStore } from "./LockedAddressStore";
import { AddressStore } from "./AddressStore";
import { BranchStore } from "./BranchStore";
import { CashbackStore } from "./CashbackStore";
import { AppStore } from "./AppStore";
import { CategoryStore } from "./CategoryStore";
import { RestaurantStore } from "./RestaurantStore";
import { CartStore } from "./CartStore";
import { InviteStore } from "./InviteStore";
import { ItemStore } from "./ItemStore";

export interface RootStoreType {
  app: AppStore;
  auth: AuthStore;
  user: UserStore;
  referralValidator: ReferralValidator;
  banners: BannerStore;
  stories: StoryStore;
  cashbacks: CashbackStore;
  addresses: AddressStore;
  lockedAddress: LockedAddressStore;
  branches: BranchStore;
  restaurants: RestaurantStore;
  categories: CategoryStore;
  cart: CartStore;
  invites: InviteStore;
  items: ItemStore;
}

export class Store implements RootStoreType {
  id: string;
  firebase: AugmentedFirebaseType;

  app = new AppStore(this);
  auth = new AuthStore(this);
  user = new UserStore(this);
  referralValidator = new ReferralValidator(this);
  banners = new BannerStore(this);
  stories = new StoryStore(this);
  cashbacks = new CashbackStore(this);
  addresses = new AddressStore(this);
  lockedAddress = new LockedAddressStore(this);
  branches = new BranchStore(this);
  restaurants = new RestaurantStore(this);
  categories = new CategoryStore(this);
  cart = new CartStore(this);
  invites = new InviteStore(this);
  items = new ItemStore(this);

  constructor(firebase: AugmentedFirebaseType) {
    this.firebase = firebase;
    this.id = uuidv4();

    console.log("INITIALIZED STORE:", this.id);

    makeAutoObservable(this, {}, { autoBind: true });
  }
}
