/**
 * Utilidades para interactuar con LemonSqueezy
 */

export interface CheckoutResponse {
  checkout_url: string;
  checkout_id: string;
}

/**
 * Creates a LemonSqueezy checkout for a user
 */
export async function createCheckout(
  variantId: string,
  accessToken: string
): Promise<CheckoutResponse> {
  const response = await fetch("/api/lemonsqueezy/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      variantId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create checkout");
  }

  return response.json();
}

/**
 * Obtiene los Variant IDs desde las variables de entorno
 */
export function getVariantIds() {
  return {
    premium: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_VARIANT_ID || "",
    premiumYearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_YEARLY_VARIANT_ID || "",
    team: process.env.NEXT_PUBLIC_LEMONSQUEEZY_TEAM_VARIANT_ID || "",
    teamYearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_TEAM_YEARLY_VARIANT_ID || "",
    agency: process.env.NEXT_PUBLIC_LEMONSQUEEZY_AGENCY_VARIANT_ID || "",
    agencyYearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_AGENCY_YEARLY_VARIANT_ID || "",
  };
}

