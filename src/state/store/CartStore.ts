import { makeAutoObservable } from "mobx";

import { TIME_SYMBOL } from "../types/symbols/all";

import type { AddressType } from "./AddressStore";
import type { CartableType } from "./ItemBuilder";

import type { Store } from "./index";

export interface CouponConfigType {
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  discountPercentage: number;

  couponName: string;
  couponDescription: string;
}

export class CartStore {
  parent: Store;

  cart: {
    [cartableID: string]: CartableType;
  } = {};

  cartCounts: {
    [cartableID: string]: number;
  } = {};

  paymentMethod: "cash" | "online" = "cash";
  address: AddressType | null = null;
  specialInstructions = "";

  coupon: string | null = null;
  isCouponValidating = false;
  isCouponValid = false;
  couponConfig: CouponConfigType | null = null;

  constructor(parent: Store) {
    this.parent = parent;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  setCouponConfig(config: CouponConfigType): void {
    this.couponConfig = config;
  }

  setSpecialInstructions(instructions: string): void {
    this.specialInstructions = instructions;
  }

  setCoupon(coupon = ""): void {
    this.coupon = `${coupon}`;
  }

  setAddress(address: AddressType): void {
    this.address = address;
  }

  setPaymentMethod(paymentMethod: "cash" | "online"): void {
    this.paymentMethod =
      paymentMethod[0].toLowerCase() === "c" ? "cash" : "online";
  }

  addCartable(cartable: CartableType): void {
    cartable[TIME_SYMBOL] = Date.now();
    this.cart[cartable.id] = cartable;
    this.incrementCartable(cartable.id);
  }

  incrementCartable(cartableID: string): void {
    this.cartCounts[cartableID] = (this.cartCounts[cartableID] || 0) + 1;
  }

  decrementCartable(cartableID: string): void {
    this.cartCounts[cartableID] = Math.max(
      (this.cartCounts[cartableID] || 0) - 1,
      0
    );
  }

  cartableCount(cartableID: string): number {
    return this.cartCounts[cartableID] || 0;
  }

  removeCartable(cartableID: string): void {
    delete this.cart[cartableID];
    delete this.cartCounts[cartableID];
  }

  clearCart(): void {
    this.cart = {};
    this.cartCounts = {};
  }

  get cartables(): CartableType[] {
    return Object.values(this.cart).sort((a, b) => {
      return (a[TIME_SYMBOL] || 0) - (b[TIME_SYMBOL] || 0);
    });
  }

  get subtotal(): number {
    return (
      Object.entries(this.cart)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([cartableID, cartable]) => [
          cartable.itemPrice * this.cartableCount(cartable.id),
          cartable.addons.map(
            (addon) =>
              addon.addonPrice *
              addon.addonCount *
              this.cartableCount(cartable.id)
          ),
          cartable.variants.map(
            (addon) => addon.variantPrice * this.cartableCount(cartable.id)
          ),
        ])
        .flat(2)
        .reduce((acc, cur) => acc + cur, 0)
    );
  }

  get deliveryCharge(): number {
    return this.parent.app?.globals?.deliveryCharge || 60;
  }

  get vat(): number {
    return (
      this.subtotal +
      this.subtotal * ((this.parent.app?.globals?.vatPercentage || 15) / 100)
    );
  }

  get serviceCharge(): number {
    return (
      this.subtotal +
      this.subtotal *
        ((this.parent.app?.globals?.serviceChargePercentage || 15) / 100)
    );
  }

  get discount(): number {
    if (!this.couponConfig) {
      return 0;
    }

    if (this.subtotal < this.couponConfig?.minimumOrderAmount) {
      return 0;
    } else {
      return Math.min(
        this.couponConfig?.maximumDiscountAmount || 0,
        this.subtotal * (this.couponConfig?.discountPercentage || 0)
      );
    }
  }

  get pointPerTaka(): number {
    return this.parent.app?.globals?.pointPerTaka || 1 / 100;
  }

  get pointsEarned(): number {
    return this.subtotal * this.pointPerTaka;
  }

  get total(): number {
    return (
      this.subtotal +
      this.vat +
      this.serviceCharge +
      this.deliveryCharge -
      this.discount
    );
  }

  get receipt() {
    return {
      subtotal: this.subtotal,
      vat: this.vat,
      serviceCharge: this.serviceCharge,
      deliveryCharge: this.deliveryCharge,
      discount: this.discount,
      total: this.total,
    };
  }

  get cartCount(): number {
    return Object.values(this.cartCounts).reduce((acc, cur) => acc + cur, 0);
  }

  get(cartableID: string): CartableType | null {
    return this.cart[cartableID] || null;
  }

  get isAllAvailable(): boolean {
    return !this.unavailableCartables.length;
  }

  get unavailableCartables(): CartableType[] {
    return Object.entries(this.cart)
      .filter(([, cartable]) => {
        const item = this.parent.items.get(cartable.itemID);

        if (!item) {
          return false;
        }

        if (!item.isAvailable) {
          return true;
        }

        return false;
      })
      .map(([, cartable]) => cartable);
  }

  get isOrderable() {
    return this.isAllAvailable;
  }

  orderable() {
    if (!this.isOrderable) {
      return null;
    }

    return {
      cart: this.cart,
      cartCounts: this.cartCounts,
      paymentMethod: this.paymentMethod,
      address: this.address,
      coupon: this.couponConfig,
    };
  }
}
