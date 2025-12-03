# 📊 Analytics Setup Guide

## Google Analytics 4 (GA4) Configuration

### 1. Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **"Start measuring"**
4. Create an **Account** (e.g., "Signature For Me")
5. Create a **Property** (e.g., "Signature For Me Web")
6. Select **Web** as the platform

### 2. Get Your Measurement ID

1. In your GA4 property, go to **Admin** (gear icon) → **Data Streams**
2. Click on your web stream
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 3. Configure Environment Variable

Add to your `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important**: Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 4. Verify Installation

1. Restart your development server: `npm run dev`
2. Visit your site
3. In GA4, go to **Reports** → **Realtime**
4. You should see your visit appear within a few seconds

## Tracked Events

The application automatically tracks:

### Authentication Events
- `sign_up` - User registration (method: email/google)
- `login` - User sign in (method: email/google)
- `logout` - User sign out

### Signature Events
- `create_signature` - New signature created (includes template name)
- `save_signature` - Signature saved/updated
- `copy_signature` - Signature copied to clipboard
- `export_signature` - Signature exported (format: PNG/PDF/HTML)
- `delete_signature` - Signature deleted
- `view_template` - Template previewed

### Subscription Events
- `view_pricing` - Pricing page viewed
- `click_upgrade` - Upgrade button clicked (includes plan name)
- `begin_checkout` - Checkout process started
- `purchase` - Subscription completed (includes plan and value)

### Navigation Events
- `click_cta` - CTA button clicked
- Page views are automatically tracked on route changes

### Error Tracking
- `exception` - Errors caught and logged

## Custom Event Tracking

You can manually track events in your code:

```typescript
import { analytics } from "@/lib/analytics";

// Track a custom event
analytics.trackEvent("button_click", "navigation", "header_cta");

// Or use predefined methods
analytics.signUp("email");
analytics.createSignature("professional");
analytics.exportSignature("PNG");
```

## Testing Analytics

### Development Mode
- Analytics is disabled if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is not set
- No errors will occur if GA is not configured

### Production Testing
1. Use GA4 DebugView:
   - Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) Chrome extension
   - Enable it and visit your site
   - View events in GA4 → **Configure** → **DebugView**

2. Use Realtime Reports:
   - Go to **Reports** → **Realtime** in GA4
   - Perform actions on your site
   - See events appear in real-time

## Privacy Considerations

- Analytics respects user privacy
- No personal information is tracked
- IP addresses are anonymized by default in GA4
- Consider adding a cookie consent banner if required by your jurisdiction

## Disable Analytics

To disable analytics:
1. Remove `NEXT_PUBLIC_GA_MEASUREMENT_ID` from `.env.local`
2. Restart your server
3. Analytics will not load

## Alternative Analytics

To use a different analytics service:

1. Modify `src/lib/analytics.ts` to use your service
2. Update `src/components/GoogleAnalytics.tsx` or create a new component
3. Replace the component in `src/app/layout.tsx`

Popular alternatives:
- [Plausible Analytics](https://plausible.io/) - Privacy-friendly
- [PostHog](https://posthog.com/) - Product analytics
- [Mixpanel](https://mixpanel.com/) - Product analytics

