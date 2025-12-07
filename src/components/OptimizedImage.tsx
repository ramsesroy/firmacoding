"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getOptimizedImageUrl, getContextualImageUrl, supportsWebP } from "@/lib/imageUtils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  onError?: () => void;
  context?: "thumbnail" | "preview" | "full";
  optimize?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  onError,
  context = "full",
  optimize = true,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [webPSupported, setWebPSupported] = useState(false);

  // Check WebP support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebPSupported(supportsWebP());
    }
  }, []);

  // Update image source when src changes
  useEffect(() => {
    if (src) {
      let optimizedSrc = src;
      
      // Apply optimization if enabled and source is not a data URL or external
      if (optimize && !src.startsWith("data:") && !src.includes("drive.google.com")) {
        if (context !== "full") {
          // Use contextual optimization
          optimizedSrc = getContextualImageUrl(src, context);
        } else if (width || height) {
          // Use specific dimensions
          optimizedSrc = getOptimizedImageUrl(src, {
            width,
            height,
            quality,
            format: webPSupported ? "webp" : undefined,
          });
        } else {
          // Use quality and format optimization
          optimizedSrc = getOptimizedImageUrl(src, {
            quality,
            format: webPSupported ? "webp" : undefined,
          });
        }
      }
      
      setImgSrc(optimizedSrc);
    }
  }, [src, context, width, height, quality, webPSupported, optimize]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to a placeholder image
      setImgSrc(
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage not available%3C/text%3E%3C/svg%3E"
      );
      onError?.();
    }
  };

  // Don't optimize data URLs or Google Drive URLs that don't support optimization
  const shouldOptimize =
    optimize &&
    !imgSrc.startsWith("data:") &&
    !imgSrc.includes("drive.google.com");

  const imageProps = fill
    ? {
        fill: true,
        sizes: sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      }
    : {
        width: width || 400,
        height: height || 300,
      };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      priority={priority}
      quality={quality}
      loading={priority ? undefined : "lazy"}
      unoptimized={!shouldOptimize}
      onError={handleError}
      {...imageProps}
    />
  );
}

