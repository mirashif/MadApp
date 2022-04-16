import {useAppState} from '../StateContext';

export function useOrders() {
    const orders = useAppState('orders');

    return {
        get error() {
            return orders.error;
        },
        get pages() {
            return orders.orderPages;
        },
        get pageCount() {
            return orders.pageCount;
        },
        get activeOrders() {
            return orders.activeOrders;
        },
        loadPage: orders.loadPage,
        clearErrors: orders.clearErrors,
        placeOrder: orders.placeOrder,
    };
}
