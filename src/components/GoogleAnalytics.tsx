"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initGA, trackPageView, isAnalyticsEnabled } from "@/lib/analytics";

export default function GoogleAnalytics() {
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

