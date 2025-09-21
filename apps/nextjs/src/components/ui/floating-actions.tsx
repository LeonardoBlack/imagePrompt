"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  ArrowUp,
  Settings,
  HelpCircle
} from "lucide-react";
import { Button } from "@saasfly/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@saasfly/ui/tooltip";

interface FloatingActionsProps {
  dict?: any;
}

export function FloatingActions({ dict }: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const actions = [
    {
      icon: Settings,
      label: "Settings",
      onClick: () => console.log("Settings clicked"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: HelpCircle,
      label: "Help",
      onClick: () => console.log("Help clicked"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: MessageCircle,
      label: "Feedback",
      onClick: () => console.log("Feedback clicked"),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-full shadow-lg bg-gray-700 hover:bg-gray-800"
                    onClick={scrollToTop}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scroll to top</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-16 right-0 space-y-3"
              >
                {actions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          className={`rounded-full shadow-lg ${action.color} text-white`}
                          onClick={action.onClick}
                        >
                          <action.icon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>{action.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            size="icon"
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MessageCircle className="h-6 w-6" />
              )}
            </motion.div>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}