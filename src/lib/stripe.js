import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe using environment variables
// Ensure VITE_STRIPE_PUBLIC_KEY is set in your .env.local file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export default stripePromise;