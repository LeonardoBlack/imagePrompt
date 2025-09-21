"use client";

import { useState, useEffect } from "react";
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

interface SimpleFloatingActionsProps {
  dict?: any;
}

export function SimpleFloatingActions({ dict }: SimpleFloatingActionsProps) {
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
        {showScrollTop && (
          <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
          </div>
        )}

        <div className="relative">
          {isOpen && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
              {actions.map((action, index) => (
                <div
                  key={action.label}
                  className="animate-in fade-in slide-in-from-right-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
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
                </div>
              ))}
            </div>
          )}

          <Button
            size="icon"
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MessageCircle className="h-6 w-6" />
              )}
            </div>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}