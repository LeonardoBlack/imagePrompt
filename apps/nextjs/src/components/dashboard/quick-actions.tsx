"use client";

import { useState } from "react";
import { Button } from "@saasfly/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saasfly/ui/card";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@saasfly/ui/select";
import { Textarea } from "@saasfly/ui/textarea";
import { useToast } from "@saasfly/ui/use-toast";

interface QuickActionProps {
  dict: any;
}

export function QuickActions({ dict }: QuickActionProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action initiated",
      description: `${action} is being processed...`,
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks at your fingertips</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleQuickAction("Create Cluster")}
            >
              <span className="mr-2">⚡</span>
              Quick Deploy
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleQuickAction("Scale Resources")}
            >
              <span className="mr-2">📈</span>
              Scale Resources
            </Button>
          </div>
          <div className="space-y-2">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleQuickAction("View Logs")}
            >
              <span className="mr-2">📋</span>
              View Logs
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleQuickAction("Monitor")}
            >
              <span className="mr-2">📊</span>
              Monitor Health
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}