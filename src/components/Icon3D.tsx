"use client";

import React from "react";

interface Icon3DProps {
  icon: string;
  className?: string;
  gradient?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Icon3D: React.FC<Icon3DProps> = ({ 
  icon, 
  className = "", 
  gradient = "from-blue-500 to-purple-500",
  size = "md"
}) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-2xl",
    lg: "w-16 h-16 text-3xl",
    xl: "w-20 h-20 text-4xl",
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${className}`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="icon-3d-float relative w-full h-full rounded-xl bg-gradient-to-br shadow-lg group cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        {/* Background gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl opacity-90`}
        />
        
        {/* Shine overlay */}
        <div 
          className="absolute inset-0 rounded-xl opacity-30"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)",
          }}
        />
        
        {/* Top shadow for depth */}
        <div 
          className="absolute inset-0 rounded-xl"
          style={{
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
          }}
        />

        {/* Icon content */}
        <div 
          className="relative w-full h-full flex items-center justify-center z-10"
          style={{ transform: "translateZ(20px)" }}
        >
          {icon}
        </div>

        {/* Glow effect */}
        <div 
          className={`absolute -inset-2 bg-gradient-to-br ${gradient} rounded-xl opacity-0 blur-xl group-hover:opacity-40 transition-opacity duration-300 icon-3d-glow`}
        />
      </div>
    </div>
  );
};

