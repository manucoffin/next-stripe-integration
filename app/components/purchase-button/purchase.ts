"use server";

import { stripeApi } from "@/app/lib/stripe-server";

export default async function purchase() {
  try {
    const priceId = process.env.STRIPE_PRICE_ID;

    const stripeCheckoutSession = await stripeApi.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/?checkout=success`,
      cancel_url: `${process.env.BASE_URL}/?checkout=cancelled`,
      metadata: {
        // Here you can add metadata to the checkout session
        // They will be return in the webhook event
        userId: "123", // For example, you can add the user id
      },
    });

    return { checkoutSessionId: stripeCheckoutSession.id };
  } catch (e) {
    console.error(e);
    return { checkoutSessionId: null };
  }
}
