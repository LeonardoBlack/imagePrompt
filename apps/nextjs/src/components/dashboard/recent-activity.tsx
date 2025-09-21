"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saasfly/ui/card";
import { MiniChart } from "./mini-chart";

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info";
}

interface RecentActivityProps {
  dict: any;
}

export function RecentActivity({ dict }: RecentActivityProps) {
  const activities: Activity[] = [
    {
      id: "1",
      title: "New cluster deployed",
      description: "Production cluster in us-west-2",
      time: "2 minutes ago",
      type: "success",
    },
    {
      id: "2",
      title: "Payment received",
      description: "$299 from customer subscription",
      time: "5 minutes ago",
      type: "info",
    },
    {
      id: "3",
      title: "High CPU usage alert",
      description: "Cluster prod-1 CPU usage above 80%",
      time: "15 minutes ago",
      type: "warning",
    },
    {
      id: "4",
      title: "User registration",
      description: "New user signed up",
      time: "1 hour ago",
      type: "info",
    },
  ];

  const chartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 700 },
    { name: "Jun", value: 900 },
  ];

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`mt-1 h-2 w-2 rounded-full ${getActivityColor(activity.type)}`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>Monthly activity trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <MiniChart data={chartData} color="#3b82f6" height={160} />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Activities</span>
            <span className="font-semibold">3,700</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}