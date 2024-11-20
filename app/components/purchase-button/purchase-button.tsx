"use client";

import { getStripe } from "@/app/lib/stripe-client";
import { useState } from "react";
import purchase from "./purchase";

export const PurchaseButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);

    const res = await purchase();

    if (!res.checkoutSessionId) {
      console.error("Failed to create stripe checkout session.");
      setIsLoading(false);
      return;
    }

    const stripe = await getStripe();
    await stripe?.redirectToCheckout({
      sessionId: res.checkoutSessionId,
    });

    setIsLoading(false);
  };

  return (
    <button
      onClick={onSubmit}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white"
    >
      {isLoading ? "Loading..." : "Purchase"}
    </button>
  );
};
