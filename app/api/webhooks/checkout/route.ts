import { NextRequest } from "next/server";
import { default as stripe, default as Stripe } from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headers = await request.headers;

  if (!process.env.STRIPE_WEBHOOK_SIGNING_SECRET) {
    return new Response("Missing stripe webhook signing secret", {
      status: 500,
    });
  }

  const webhookSigningSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET!;
  const stripeSignature = headers.get("stripe-signature");

  if (!stripeSignature) {
    return new Response("Missing stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      webhookSigningSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      {
        status: 400,
      }
    );
  }

  // Only handle checkout.session.completed for now
  // but you can add more event types as needed
  if (event.type !== "checkout.session.completed") {
    return new Response(`Unhandled event type: ${event.type}`, { status: 400 });
  }

  const checkoutSession = event.data.object as Stripe.Checkout.Session;

  try {
    const userId = checkoutSession.metadata?.userId;
    const userEmail = checkoutSession.customer_details?.email;

    // Update your database here
    // For example, you might want to update the user's subscription status:
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { subscriptionStatus: "ACTIVE" },
    // });

    console.log(`Payment processed for user ${userId} (${userEmail})`);

    return new Response("Payment processed successfully", { status: 200 });
  } catch (error) {
    console.error("Payment processing failed:", error);

    // Don't expose internal error details in the response
    return new Response("Internal server error", { status: 500 });
  }
}
