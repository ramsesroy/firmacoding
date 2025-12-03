"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

export default function ScrollAnimation({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-in");
            }, delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const directionClasses = {
    up: "animate-slide-up",
    down: "animate-slide-down",
    left: "animate-slide-left",
    right: "animate-slide-right",
    fade: "animate-fade-in",
  };

  return (
    <div
      ref={ref}
      className={`opacity-0 ${directionClasses[direction]} ${className}`}
    >
      {children}
    </div>
  );
}

