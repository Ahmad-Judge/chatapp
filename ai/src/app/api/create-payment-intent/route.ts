// /api/create-payment-intent.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json(); // Payment amount in cents (e.g., $10 -> 1000)

    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency: 'usd', 
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
