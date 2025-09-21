"use client";

import { useEffect, useState } from "react";
import { cn } from "@saasfly/ui";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  text?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  className = "", 
  showText = false, 
  text = "Loading..." 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        <div className={cn(
          "animate-spin rounded-full border-2 border-primary border-t-transparent",
          sizeClasses[size]
        )} />
        <div className={cn(
          "absolute inset-0 animate-ping rounded-full border-2 border-primary opacity-20",
          sizeClasses[size]
        )} />
      </div>
      {showText && (
        <p className="mt-2 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingDots({ className = "", size = "md" }: LoadingDotsProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size])} />
      <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size], "animation-delay-200")} />
      <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size], "animation-delay-400")} />
    </div>
  );
}