"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface WelcomeAnimationProps {
  userName?: string;
  dict: any;
}

export function WelcomeAnimation({ userName = "User", dict }: WelcomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-blue-600" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Welcome back, {userName}! 👋
              </h2>
              <p className="text-sm text-gray-600">
                Here's what's happening with your projects today.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}