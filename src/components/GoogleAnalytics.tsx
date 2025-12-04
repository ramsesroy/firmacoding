"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initGA, trackPageView, isAnalyticsEnabled } from "@/lib/analytics";

function GoogleAnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize GA if enabled
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    
    if (isAnalyticsEnabled() && measurementId) {
      initGA(measurementId);
    }
  }, []);

  useEffect(() => {
    // Track page views on route change
    if (isAnalyticsEnabled() && pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  // Only render on client side
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAnalyticsEnabled()) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent />
    </Suspense>
  );
}

