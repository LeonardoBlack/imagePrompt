"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface SimpleWelcomeProps {
  userName?: string;
  dict?: any;
}

export function SimpleWelcome({ userName = "User", dict }: SimpleWelcomeProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [sparkleRotation, setSparkleRotation] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    const rotationTimer = setInterval(() => {
      setSparkleRotation(prev => (prev + 1) % 360);
    }, 16);

    return () => {
      clearTimeout(timer);
      clearInterval(rotationTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center space-x-3">
        <div style={{ transform: `rotate(${sparkleRotation}deg)` }}>
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome back, {userName}! 👋
          </h2>
          <p className="text-sm text-gray-600">
            Here's what's happening with your projects today.
          </p>
        </div>
      </div>
    </div>
  );
}