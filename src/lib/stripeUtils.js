import { STRIPE_CONFIG } from '@/config/stripeConfig';

/**
 * Frontend utility for formatting order data.
 * Webhook signature verification and secure session creation MUST happen on a backend server.
 */
export const formatOrderData = (paymentIntent) => {
  return {
    orderId: paymentIntent?.id || generateOrderId(),
    amount: STRIPE_CONFIG.PRICE_USD,
    status: paymentIntent?.status || 'succeeded',
    timestamp: new Date().toISOString()
  };
};

export const generateOrderId = () => {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
};