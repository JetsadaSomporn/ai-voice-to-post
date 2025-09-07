import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ⚠️ IMPORTANT: Update these price IDs with your actual Stripe price IDs
// Create products and prices in your Stripe dashboard first
export const STRIPE_PRICE_ID = {
  PLUS_MONTHLY: 'price_plus_monthly', // Replace with actual Stripe price ID from your dashboard
  PLUS_YEARLY: 'price_plus_yearly',   // Replace with actual Stripe price ID from your dashboard
} as const;

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '5 voice transcriptions per day',
      '5 AI post generations per day',
      'Basic post templates',
      'Limited history (7 days)',
    ],
    limits: {
      transcriptions: 5,
      generations: 5,
      historyDays: 7,
    }
  },
  PLUS: {
    name: 'Plus',
    price: 299, // 299 THB per month
    priceYearly: 2990, // 2990 THB per year (save 2 months)
    features: [
      'Unlimited voice transcriptions',
      'Unlimited AI post generations',
      'Premium post templates',
      'Full history access',
      'Export to PDF',
      'Priority support',
      'Advanced customization',
    ],
    limits: {
      transcriptions: -1, // Unlimited
      generations: -1,    // Unlimited
      historyDays: -1,    // Unlimited
    }
  }
} as const;
