import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {CartablePacket} from './Cartable';
import {profile} from '../helpers/profile';
import {Freebie} from './FreebieStore';

export class CouponEditor {
    code: string = '';

    constructor(public parent: CartStore) {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    setCode(code: string) {
        this.code = code.toLowerCase();
    }

    get isValid() {
        return (
            this.couponExists &&
            (this.deal!!.data.minOrderAmount ?? 0) <= this.parent.subtotalAmount
        );
    }

    get invalidityReason() {
        const minOrderAmount = this.deal?.data?.minOrderAmount ?? 0;
        const diff = minOrderAmount - this.parent.subtotalAmount;
        return `The minimum order value for this voucher is ৳${minOrderAmount}, add ৳${diff} to your cart.`;
    }

    get couponExists() {
        return !!this.deal;
    }

    get deal() {
        if (this.code in this.parent.parent.deals.coupons) {
            return this.parent.parent.deals.coupons[this.code];
        }

        return null;
    }

    applyCoupon() {
        if (this.isValid) {
            this.parent.applyCoupon(this.deal!!.data.id);
        }
    }
}

export class CartableWrapper {
    readonly additionTime = new Date();

    constructor(public parent: CartStore, public packet: CartablePacket) {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    decrement() {
        const targetCount = Math.max(this.packet.data.count - 1, 0);

        if (targetCount === 0) {
            this.remove();
        } else {
            this.packet.data.count = targetCount;
        }
    }

    increment() {
        this.packet.data.count = this.packet.data.count + 1;
    }

    remove() {
        this.parent.remove(this);
    }

    get itemID() {
        return this.packet.data.item.id;
    }

    get itemName() {
        return this.packet.data.item.data.name;
    }

    get itemThumbnailURI() {
        return this.packet.data.item.data.thumbnailURI;
    }

    get count() {
        return this.packet.data.count;
    }

    get price() {
        return this.packet.data.price;
    }

    get originalPrice() {
        return this.packet.data.originalPrice;
    }

    get totalPrice() {
        return this.price * this.count;
    }

    get additions() {
        const variants = Object.values(this.packet.data.variants).map(
            (pair) => {
                return pair.selectedVariant?.data.name ?? '';
            },
        );

        const addons = Object.values(this.packet.data.addons).map((pair) => {
            return `${pair.addon.data.name} x ${pair.count}`;
        });

        return [...variants, ...addons].join(', ');
    }

    get freebies() {
        return this.packet.data.freebies;
    }
}

export class FreebieWrapper {
    constructor(public parent: CartStore, public freebie: Freebie) {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    select() {
        this.parent.selectFreebie(this.freebie.data.id);
    }

    get isSelected() {
        return this.parent.freebieID === this.freebie.data.id;
    }
}

export type PaymentMethodType = 'cash-on-delivery' | 'bkash' | 'card';

export class CartStore {
    parent: Store;

    cart: {
        [cartableID: string]: CartableWrapper;
    } = {};

    couponDealID: string | null = null;
    freebieID: string | null | false = null;
    paymentMethod: PaymentMethodType = 'cash-on-delivery';
    specialInstructions: string = '';

    constructor(parent: Store) {
        this.parent = parent;
        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(cartablePacket: CartablePacket) {
        const _p = profile('CartStore.upsert');

        if (cartablePacket.data.id in this.cart) {
            this.cart[cartablePacket.data.id].packet.data.count =
                cartablePacket.data.count +
                this.cart[cartablePacket.data.id].packet.data.count;
        } else {
            this.cart[cartablePacket.data.id] = new CartableWrapper(
                this,
                cartablePacket,
            );
        }

        _p();
    }

    remove(wrapper: CartableWrapper) {
        delete this.cart[wrapper.packet.data.id];
    }

    get all() {
        const _p = profile('CartStore.all');

        return _p(
            Object.values(this.cart).sort(
                (a, b) => a.additionTime.getTime() - b.additionTime.getTime(),
            ),
        );
    }

    setSpecialInstructions(specialInstructions: string) {
        this.specialInstructions = specialInstructions;
    }

    clearCart() {
        this.cart = {};
    }

    get freebies() {
        const freebieSet = new Set<Freebie>();

        Object.values(this.cart).forEach((wrapper) => {
            wrapper.freebies.forEach((freebie) => freebieSet.add(freebie));
        });

        return [...freebieSet];
    }

    get itemIDs() {
        const itemIDSet = new Set();

        Object.values(this.cart).forEach((wrapper) =>
            itemIDSet.add(wrapper.itemID),
        );

        return [...itemIDSet];
    }

    get upsellItems() {
        // TODO: lol wtf?
        const items = this.parent.items.all;

        const start = Math.floor(Math.random() * (items.length - 6));
        const end = start + 5;

        return items.slice(start, end);
    }

    get originalTotal() {
        return Object.values(this.cart)
            .map((wrapper) => wrapper.originalPrice * wrapper.count)
            .reduce((a, b) => a + b, 0);
    }

    get subtotalAmount() {
        return Object.values(this.cart)
            .map((wrapper) => wrapper.price * wrapper.count)
            .reduce((a, b) => a + b, 0);
    }

    get vatAmount() {
        return Math.ceil(
            this.originalTotal *
                (this.parent.app.globals?.vatPercentage ?? 0.15),
        );
    }

    get serviceChargeAmount() {
        return Math.ceil(
            Object.values(this.cart)
                .map((wrapper) =>
                    wrapper.packet.data.item.data.hasSDCharge
                        ? wrapper.originalPrice * wrapper.count
                        : 0,
                )
                .reduce((a, b) => a + b, 0) *
                (this.parent.app.globals?.serviceChargePercentage ?? 0.2),
        );
    }

    get discountableAmount() {
        return Object.values(this.cart)
            .map((wrapper) =>
                wrapper.packet.data.isDealApplied
                    ? 0
                    : wrapper.originalPrice * wrapper.count,
            )
            .reduce((a, b) => a + b, 0);
    }

    get discountAmount() {
        if (!this.couponDeal) {
            return 0;
        }

        const discountableAmount = this.discountableAmount;
        const discounted = this.couponDeal.genericScript(discountableAmount);

        return discounted === true || discounted === false
            ? 0
            : discountableAmount - discounted;
    }

    get couponEditor() {
        return new CouponEditor(this);
    }

    get couponDeal() {
        if (!this.couponDealID) {
            return null;
        }

        return this.parent.deals.coupons[this.couponDealID] ?? null;
    }

    applyCoupon(dealID: string) {
        this.couponDealID = dealID;
    }

    clearCoupon() {
        this.couponDealID = null;
    }

    get deliveryChargeAmount() {
        return this.parent.app.globals?.deliveryCharge ?? 60;
    }

    get grandTotalAmount() {
        return (
            this.subtotalAmount +
            this.vatAmount +
            this.serviceChargeAmount +
            this.deliveryChargeAmount -
            this.discountAmount
        );
    }

    selectFreebie(freebieID: string) {
        this.freebieID = freebieID;
    }

    noFreebies() {
        this.freebieID = false;
    }

    get freebie() {
        if (!this.freebieID) {
            return null;
        }

        return this.parent.freebies.get(this.freebieID);
    }

    selectPaymentMethod(method: 'cash-on-delivery' | 'bkash' | 'card') {
        this.paymentMethod = method;
    }
}
