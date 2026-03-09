export const ORDER_STATUS_LABELS = {
    pending: 'Pending confirmation',
    payment_received: 'Payment received',
    packed: 'Packed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    unverified: 'Payment pending',
};

export const getOrderStatusLabel = (status) => {
    const key = String(status || 'pending');
    return ORDER_STATUS_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
};

export const isPaymentPendingStatus = (status) => {
    const s = String(status || 'pending');
    return s === 'pending' || s === 'unverified';
};

export const getOrderEmailHeadline = (status) => {
    if (isPaymentPendingStatus(status)) return 'Order placed successfully';
    if (String(status) === 'payment_received') return 'Payment received';
    if (String(status) === 'cancelled') return 'Order cancelled';
    if (String(status) === 'delivered') return 'Order delivered';
    return 'Order status updated';
};

export const getOrderEmailMessage = (status) => {
    const s = String(status || 'pending');

    if (s === 'pending') return 'Your order has been placed successfully and is pending confirmation.';
    if (s === 'unverified') return 'Your order is awaiting payment confirmation.';
    if (s === 'payment_received') return 'We have received your payment and will start processing your order.';
    if (s === 'packed') return 'Your order has been packed and will be handed over to our delivery partner soon.';
    if (s === 'processing') return 'Your order is being processed.';
    if (s === 'shipped') return 'Your order has been shipped.';
    if (s === 'delivered') return 'Your order has been delivered. Thank you for shopping with us.';
    if (s === 'cancelled') return 'Your order has been cancelled.';

    return 'Your order status has been updated.';
};
