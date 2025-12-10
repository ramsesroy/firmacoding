import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://signaturefor.me';
const siteName = 'Signature For Me';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Professional Email Signature Generator | Signature For Me",
    template: "%s | Signature For Me",
  },
  description: "Create professional email signatures in minutes. Free email signature generator for Gmail, Outlook, and more. Customizable templates, HTML export. 100% free!",
  keywords: [
    "email signature",
    "email signature generator",
    "professional email signature",
    "Gmail signature",
    "Outlook signature",
    "email signature creator",
    "HTML email signature",
    "email signature template",
    "business email signature",
    "free email signature",
    "email signature maker",
    "signature generator",
    "email footer",
    "professional signature",
  ],
  authors: [{ name: "Signature For Me" }],
  creator: "Signature For Me",
  publisher: "Signature For Me",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "Professional Email Signature Generator - Free & Easy",
    description: "Create professional email signatures in minutes. Customizable templates for Gmail, Outlook, and more. 100% free, no credit card required.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Signature For Me - Professional Email Signature Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Email Signature Generator - Free & Easy",
    description: "Create professional email signatures in minutes. Customizable templates for Gmail, Outlook, and more. 100% free.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@signatureforme",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console verification - add when you have the code
    // google: "verification-code",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Signature For Me" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ToastProvider>
            <GoogleAnalytics />
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
