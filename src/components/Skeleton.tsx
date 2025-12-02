"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "",
    rounded: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-label="Loading..."
      role="status"
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
    <Skeleton variant="rectangular" height={24} width="60%" className="mb-4" />
    <Skeleton variant="text" height={16} width="100%" className="mb-2" />
    <Skeleton variant="text" height={16} width="80%" />
  </div>
);

export const SkeletonSignaturePreview: React.FC = () => (
  <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-6 sm:p-10 border-2 border-gray-100">
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="flex-1 space-y-3">
          <Skeleton variant="rectangular" height={24} width="40%" />
          <Skeleton variant="rectangular" height={20} width="60%" />
          <Skeleton variant="rectangular" height={16} width="50%" />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonForm: React.FC = () => (
  <div className="space-y-6">
    <div>
      <Skeleton variant="rectangular" height={20} width="30%" className="mb-3" />
      <Skeleton variant="rounded" height={48} width="100%" />
    </div>
    <div>
      <Skeleton variant="rectangular" height={20} width="30%" className="mb-3" />
      <Skeleton variant="rounded" height={48} width="100%" />
    </div>
    <div>
      <Skeleton variant="rectangular" height={20} width="40%" className="mb-3" />
      <Skeleton variant="rounded" height={120} width="100%" />
    </div>
  </div>
);

