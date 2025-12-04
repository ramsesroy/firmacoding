# Signature For Me - Email Signature Generator SaaS

Professional email signature generator SaaS application built with Next.js, TypeScript, and Supabase.

## Technologies

- Next.js 16
- TypeScript
- Tailwind CSS
- Supabase (Database and Authentication)
- LemonSqueezy (Payment Processing)

## Setup

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# LemonSqueezy Configuration
LEMONSQUEEZY_API_KEY=tu_api_key_de_lemonsqueezy
LEMONSQUEEZY_STORE_ID=tu_store_id_de_lemonsqueezy
LEMONSQUEEZY_WEBHOOK_SECRET=tu_webhook_secret_de_lemonsqueezy

# LemonSqueezy Variant IDs (IDs de los productos/planes)
NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_VARIANT_ID=variante_id_premium
NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_YEARLY_VARIANT_ID=variante_id_premium_anual (opcional)
NEXT_PUBLIC_LEMONSQUEEZY_TEAM_VARIANT_ID=variante_id_team (opcional)
NEXT_PUBLIC_LEMONSQUEEZY_AGENCY_VARIANT_ID=variante_id_agency (opcional)

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
# En producción: NEXT_PUBLIC_APP_URL=https://tu-dominio.com

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# Get your Measurement ID from Google Analytics 4: https://analytics.google.com

# AI Generator Webhook (Optional - Premium Feature)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-webhook-url.n8n.cloud/webhook/ai-signature
# Get your webhook URL from your n8n workflow
```

**Important Notes**: 
- You can get Supabase credentials from your project at [Supabase](https://supabase.com).
- You can get LemonSqueezy credentials from the [LemonSqueezy](https://app.lemonsqueezy.com/) dashboard.
- See `LEMONSQUEEZY_SETUP.md` for detailed setup instructions.

### Database

Execute the SQL script `supabase-setup.sql` in the Supabase SQL Editor to create the `signatures` table with the necessary security policies.

Also execute `supabase-subscriptions.sql` to set up the subscription system.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Application pages
- `/src/components` - Reusable components
- `/src/lib` - Utilities and helper functions
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks

