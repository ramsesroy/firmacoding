// Analytics utility functions
// Supports Google Analytics 4 and can be extended for other services

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  if (typeof window === "undefined") return;

  // Prevent double initialization
  if (window.gtag) return;

  // Load gtag script
  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date() as any);
  window.gtag("config", measurementId, {
    page_path: window.location.pathname,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Common event tracking functions
export const analytics = {
  // Authentication events
  signUp: (method: string) => {
    trackEvent("sign_up", "authentication", method);
  },
  signIn: (method: string) => {
    trackEvent("login", "authentication", method);
  },
  signOut: () => {
    trackEvent("logout", "authentication");
  },

  // Signature events
  createSignature: (template: string) => {
    trackEvent("create_signature", "signature", template);
  },
  saveSignature: () => {
    trackEvent("save_signature", "signature");
  },
  exportSignature: (format: string) => {
    trackEvent("export_signature", "signature", format);
  },
  deleteSignature: () => {
    trackEvent("delete_signature", "signature");
  },
  copySignature: () => {
    trackEvent("copy_signature", "signature");
  },

  // Subscription events
  viewPricing: () => {
    trackEvent("view_pricing", "subscription");
  },
  clickUpgrade: (plan: string) => {
    trackEvent("click_upgrade", "subscription", plan);
  },
  startCheckout: (plan: string) => {
    trackEvent("begin_checkout", "subscription", plan);
  },
  completePurchase: (plan: string, value?: number) => {
    trackEvent("purchase", "subscription", plan, value);
  },

  // Navigation events
  clickCTA: (location: string, ctaText: string) => {
    trackEvent("click_cta", "navigation", `${location}: ${ctaText}`);
  },
  viewTemplate: (template: string) => {
    trackEvent("view_template", "content", template);
  },

  // Error tracking
  trackError: (error: string, errorInfo?: string) => {
    trackEvent("exception", "error", error, undefined);
    if (errorInfo) {
      console.error("Analytics Error:", error, errorInfo);
    }
  },
};

// Check if analytics is enabled
export const isAnalyticsEnabled = () => {
  return !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
};

