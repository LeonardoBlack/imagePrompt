"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@saasfly/ui/tooltip";

interface DashboardNavProps {
  items: Array<{
    href: string;
    title: string;
    icon: string;
    disabled?: boolean;
  }>;
  params: { lang: string };
}

export function DashboardNav({ items, params }: DashboardNavProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    // Simple icon mapping - in a real app you'd import actual icons
    const iconMap: Record<string, string> = {
      dashboard: "📊",
      kubernetes: "☸️",
      billing: "💳",
      settings: "⚙️",
      documentation: "📚",
      support: "🆘",
    };
    return iconMap[iconName] || "📋";
  };

  return (
    <TooltipProvider>
      <nav className="grid items-start gap-2">
        {items.map((item, index) => {
          const href = `/${params.lang}${item.href}`;
          const isActive = pathname === href || pathname?.startsWith(`${href}/`);
          const icon = getIcon(item.icon);

          return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "group relative flex h-12 w-full items-center justify-start px-4",
                    isActive && "bg-accent text-accent-foreground font-medium"
                  )}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span
                    className={cn(
                      "mr-3 text-lg transition-transform duration-200",
                      hoveredItem === item.href && "scale-110"
                    )}
                  >
                    {icon}
                  </span>
                  <span
                    className={cn(
                      "transition-all duration-200",
                      isActive && "font-medium"
                    )}
                  >
                    {item.title}
                  </span>
                  {isActive && (
                    <div className="absolute right-2 h-2 w-2 rounded-full bg-current" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}