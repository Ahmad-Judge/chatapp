// /api/create-payment-intent.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
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
