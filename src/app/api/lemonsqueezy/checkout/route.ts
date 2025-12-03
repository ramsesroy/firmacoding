import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * API Route to create a LemonSqueezy checkout
 * POST /api/lemonsqueezy/checkout
 */
export async function POST(request: NextRequest) {
  try {
    const { variantId, userId } = await request.json();

    if (!variantId) {
      return NextResponse.json(
        { error: "Variant ID is required" },
        { status: 400 }
      );
    }

    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID not configured" },
        { status: 500 }
      );
    }

    // Create checkout in LemonSqueezy
    const checkoutResponse = await fetch(
      `https://api.lemonsqueezy.com/v1/checkouts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              custom_price: null,
              product_options: {
                name: "Signature For Me Premium",
                description: "Upgrade to Premium plan",
                media: [],
                redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`,
                receipt_button_text: "Go to Dashboard",
                receipt_link_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
                receipt_thank_you_note: "Thank you for subscribing!",
              },
              checkout_options: {
                embed: false,
                media: false,
                logo: false,
              },
              checkout_data: {
                email: user.email || "",
                name: user.user_metadata?.full_name || user.email || "",
                custom: {
                  user_id: user.id,
                },
              },
              expires_at: null,
              preview: false,
              test_mode: process.env.NODE_ENV !== "production",
            },
            relationships: {
              store: {
                data: {
                  type: "stores",
                  id: storeId,
                },
              },
              variant: {
                data: {
                  type: "variants",
                  id: variantId,
                },
              },
            },
          },
        }),
      }
    );

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.json();
      console.error("LemonSqueezy checkout error:", errorData);
      return NextResponse.json(
        { error: "Failed to create checkout", details: errorData },
        { status: 500 }
      );
    }

    const checkoutData = await checkoutResponse.json();
    const checkoutUrl = checkoutData.data.attributes.url;

    return NextResponse.json({
      checkout_url: checkoutUrl,
      checkout_id: checkoutData.data.id,
    });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

