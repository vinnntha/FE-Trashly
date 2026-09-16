"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right" | "zoom-in";
  delay?: number;
  duration?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getInitialClasses = () => {
    switch (animation) {
      case "fade-up":
        return "opacity-0 translate-y-8";
      case "fade-in":
        return "opacity-0";
      case "fade-left":
        return "opacity-0 -translate-x-8";
      case "fade-right":
        return "opacity-0 translate-x-8";
      case "zoom-in":
        return "opacity-0 scale-95";
      default:
        return "opacity-0 translate-y-8";
    }
  };

  const getVisibleClasses = () => {
    switch (animation) {
      case "fade-up":
        return "opacity-100 translate-y-0";
      case "fade-in":
        return "opacity-100";
      case "fade-left":
        return "opacity-100 translate-x-0";
      case "fade-right":
        return "opacity-100 translate-x-0";
      case "zoom-in":
        return "opacity-100 scale-100";
      default:
        return "opacity-100 translate-y-0";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-out ${
        isVisible ? getVisibleClasses() : getInitialClasses()
      } ${className}`}
    >
      {children}
    </div>
  );
}
