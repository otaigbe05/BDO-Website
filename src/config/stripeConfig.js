// These keys must be set in your .env.local file
export const STRIPE_HOSTED_CHECKOUT_CONFIG = {
  PRODUCT_ID: import.meta.env.VITE_STRIPE_PRODUCT_ID || 'prod_UFjTuClMjWh5Yf',
  PRICE_USD: 29,
  PRICE_CENTS: 2900,
  PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  SUCCESS_URL: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  CANCEL_URL: `${window.location.origin}/cart`
};

export const STRIPE_CONFIG = {
  PRODUCT_ID: import.meta.env.VITE_STRIPE_PRODUCT_ID || 'prod_UFjTuClMjWh5Yf',
  PRICE_USD: 29,
  PRODUCT_NAME: 'Business Templates Bundle (8 Templates)'
};