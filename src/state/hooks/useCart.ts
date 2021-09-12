import { useAppState } from "../StateContext";

export function useCart() {
  const cart = useAppState("cart");

  return {
    get specialInstructions() {
      return cart.specialInstructions;
    },
    get coupon() {
      return cart.coupon;
    },
    get paymentMethod() {
      return cart.paymentMethod;
    },
    get address() {
      return cart.address;
    },
    get cart() {
      return cart.cartables;
    },
    get pointsEarned() {
      return cart.pointsEarned;
    },
    get receipt() {
      return cart.receipt;
    },
    get length() {
      return cart.cartCount;
    },
    get isOrderable() {
      return cart.isOrderable;
    },
    get unavailableCartables() {
      return cart.unavailableCartables;
    },
    get isAllAvailable() {
      return cart.isAllAvailable;
    },
    get isCouponValidating() {
      return cart.isCouponValidating;
    },
    get isCouponValid() {
      return cart.isCouponValid;
    },
    setSpecialInstructions: cart.setSpecialInstructions,
    setCoupon: cart.setCoupon,
    setAddress: cart.setAddress,
    setPaymentMethod: cart.setPaymentMethod,
    addCartable: cart.addCartable,
    incrementCartable: cart.incrementCartable,
    decrementCartable: cart.decrementCartable,
    cartableCount: cart.cartableCount,
    removeCartable: cart.removeCartable,
    clearCart: cart.clearCart,
    orderable: cart.orderable,
  };
}
