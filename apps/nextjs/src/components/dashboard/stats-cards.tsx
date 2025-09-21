"use client";

import { ArrowUpRight, Users, Server, Activity, DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@saasfly/ui/card";
import { AnimatedCounter } from "~/components/ui/animated-counter";

interface StatsCardsProps {
  dict: any;
}

export function StatsCards({ dict }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Clusters",
      value: "12",
      change: "+4",
      icon: Server,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "+0.3%",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.title === "Total Revenue" ? (
                stat.value
              ) : stat.title === "Active Users" ? (
                <AnimatedCounter value={2350} />
              ) : stat.title === "Active Clusters" ? (
                <AnimatedCounter value={12} />
              ) : (
                "99.9%"
              )}
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-xs ${stat.color} font-medium`}>
                {stat.change}
              </span>
              <ArrowUpRight className={`h-3 w-3 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}