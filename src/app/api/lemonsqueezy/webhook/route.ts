import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import crypto from "crypto";

/**
 * Webhook handler for LemonSqueezy events
 * POST /api/lemonsqueezy/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature");

    // Verify webhook signature
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify HMAC signature
    const hmac = crypto.createHmac("sha256", webhookSecret);
    const digest = hmac.update(body).digest("hex");

    if (signature !== digest) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Process different event types
    switch (event.meta.event_name) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_payment_success":
        await handleSubscriptionEvent(event);
        break;

      case "subscription_cancelled":
      case "subscription_payment_failed":
      case "subscription_expired":
        await handleSubscriptionCancellation(event);
        break;

      case "order_created":
        await handleOrderCreated(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.meta.event_name}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handles subscription events (creation, update, successful payment)
 */
async function handleSubscriptionEvent(event: any) {
  const subscription = event.data;
  const attributes = subscription.attributes;
  const customData = attributes.custom;

  if (!customData?.user_id) {
    console.error("No user_id in custom data");
    return;
  }

  const userId = customData.user_id;

  // Determine plan type based on variant_id
  const variantId = subscription.attributes.variant_id;
  const planType = getPlanTypeFromVariantId(variantId);

  // Update or create subscription in Supabase
  const subscriptionData = {
    user_id: userId,
    plan_type: planType,
    status: mapLemonSqueezyStatus(attributes.status),
    lemonsqueezy_subscription_id: subscription.id,
    lemonsqueezy_customer_id: attributes.customer_id?.toString(),
    lemonsqueezy_order_id: attributes.order_id?.toString(),
    lemonsqueezy_variant_id: variantId?.toString(),
    current_period_start: attributes.renews_at
      ? new Date(attributes.renews_at).toISOString()
      : new Date().toISOString(),
    current_period_end: attributes.renews_at
      ? new Date(attributes.renews_at).toISOString()
      : null,
    cancel_at_period_end: attributes.cancelled || false,
    updated_at: new Date().toISOString(),
  };

  // Check if subscription already exists for this user
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existingSubscription) {
    // Update existing subscription
    await supabase
      .from("subscriptions")
      .update(subscriptionData)
      .eq("user_id", userId);
  } else {
    // Create new subscription
    subscriptionData.current_period_start = new Date().toISOString();
    await supabase.from("subscriptions").insert([subscriptionData]);
  }

  console.log(`Subscription ${subscription.id} processed for user ${userId}`);
}

/**
 * Handles subscription cancellations
 */
async function handleSubscriptionCancellation(event: any) {
  const subscription = event.data;
  const attributes = subscription.attributes;
  const customData = attributes.custom;

  if (!customData?.user_id) {
    console.error("No user_id in custom data");
    return;
  }

  const userId = customData.user_id;

  // Update subscription status to canceled
  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  console.log(`Subscription ${subscription.id} cancelled for user ${userId}`);
}

/**
 * Handles order creation
 */
async function handleOrderCreated(event: any) {
  const order = event.data;
  const attributes = order.attributes;
  const customData = attributes.custom;

  if (!customData?.user_id) {
    console.error("No user_id in custom data");
    return;
  }

  const userId = customData.user_id;

  // Update subscription with order_id
  await supabase
    .from("subscriptions")
    .update({
      lemonsqueezy_order_id: order.id,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  console.log(`Order ${order.id} created for user ${userId}`);
}

/**
 * Maps LemonSqueezy status to our database status
 */
function mapLemonSqueezyStatus(status: string): "active" | "canceled" | "past_due" | "trialing" {
  switch (status) {
    case "active":
    case "on_trial":
      return status === "on_trial" ? "trialing" : "active";
    case "cancelled":
    case "expired":
      return "canceled";
    case "past_due":
      return "past_due";
    default:
      return "active";
  }
}

/**
 * Gets the plan type based on variant_id
 * Note: These variant IDs must be configured in environment variables
 */
function getPlanTypeFromVariantId(variantId: string | number): "free" | "premium" | "team" | "agency" {
  const premiumVariantId = process.env.LEMONSQUEEZY_PREMIUM_VARIANT_ID;
  const teamVariantId = process.env.LEMONSQUEEZY_TEAM_VARIANT_ID;
  const agencyVariantId = process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID;

  const variantIdStr = variantId.toString();

  if (variantIdStr === premiumVariantId) return "premium";
  if (variantIdStr === teamVariantId) return "team";
  if (variantIdStr === agencyVariantId) return "agency";
  
  return "premium"; // Default
}

