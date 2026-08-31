# Signature For Me — Email Signature Generator SaaS

A professional email signature generator SaaS built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Supabase**, and **LemonSqueezy**.

🌐 **Live:** [firmacoding.vercel.app](https://firmacoding.vercel.app)

---

## Features

- **19 professional templates** — Classic, Modern, QR, Developer, University, Church, Law, and more
- **Canvas Editor** — Drag-and-drop signature builder with custom rows, columns, and elements
- **Multiple export formats** — HTML, PNG (high-res), PDF, ZIP
- **Freemium model** — Free tier with watermark, Premium without limits
- **Authentication** — Email/password via Supabase Auth
- **Save & manage signatures** — Per-user signature storage in Supabase
- **Link click analytics** — Track clicks on signature links (Premium)
- **QR code integration** — Dynamic QR codes in specific templates
- **SEO optimized** — Sitemap, robots.txt, JSON-LD schema, Open Graph
- **Blog** — Built-in blog with email signature guides
- **Payment system** — LemonSqueezy integration (webhooks + checkout)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.5 |
| Styles | Tailwind CSS 3.4 |
| Database / Auth | Supabase (PostgreSQL + Auth) |
| Payments | LemonSqueezy |
| Analytics | Google Analytics 4 |
| Export | html2canvas, jsPDF, @react-pdf/renderer, JSZip |

## Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── dashboard/     # Protected user area (editor, canvas, analytics, settings)
│   ├── api/           # API routes (LemonSqueezy, analytics, Cloudflare)
│   ├── blog/          # Blog with SEO-optimized articles
│   └── legal/         # Terms, Privacy, Cookies, License
├── components/
│   ├── SignaturePreview.tsx   # Core signature renderer (19 templates)
│   ├── canvas/               # Canvas editor components
│   └── Pricing.tsx           # Pricing section
├── lib/
│   ├── signatureUtils.ts      # Template HTML/CSS generation
│   ├── exportUtils.ts         # PNG, PDF, HTML, ZIP export logic
│   ├── imageUtils.ts          # Image upload + compression
│   ├── subscriptionUtils.ts   # Plan limits and permissions
│   └── canvas/                # Canvas state management
├── hooks/
│   └── useSubscription.ts     # User subscription state
└── types/
    ├── signature.ts           # Signature and template types
    └── canvas.ts              # Canvas editor types
```

## Setup

### 1. Clone and install

```bash
git clone https://github.com/ramsesroy/firmacoding.git
cd firmacoding
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# LemonSqueezy (payments)
LEMONSQUEEZY_API_KEY=your_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_VARIANT_ID=your_variant_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database setup

Run the SQL scripts in `/db/` in order via the Supabase SQL Editor:

1. `supabase-setup.sql` — signatures table
2. `supabase-subscriptions.sql` — subscriptions + user limits
3. `supabase-canvas-setup.sql` — canvas signatures table
4. `supabase-link-analytics-setup.sql` — link click analytics

Also create a public Storage bucket named **`demomail`** in Supabase dashboard.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deployed on **Vercel**. Set all environment variables in the Vercel project settings.

---

Built by [Ramsés Roy](https://github.com/ramsesroy)
