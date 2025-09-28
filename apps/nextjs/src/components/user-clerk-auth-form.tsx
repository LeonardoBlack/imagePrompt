"use client";

import * as React from "react";
import { redirect } from "next/navigation";
// import { SignIn, useUser } from "@clerk/nextjs";

import { cn } from "@saasfly/ui";
import { LoadingSpinner } from "~/components/ui/loading-spinner";

type Dictionary = Record<string, string>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
  dict?: Dictionary;
  disabled?: boolean;
}

export function UserClerkAuthForm({
  className,
  lang,
  dict,
  ...props
}: UserAuthFormProps) {
  // const { user, isLoaded } = useUser()
  
  // 禁用 Clerk 认证，显示开发模式提示
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Authentication Disabled</h3>
          <p className="text-sm text-muted-foreground">
            Clerk authentication is currently disabled for development mode.
          </p>
          <button 
            onClick={() => window.location.href = `/${lang}/dashboard`}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
  
  /* 原始代码暂时注释掉
  // 等待用户数据加载完成
  if (!isLoaded) {
    return (
      <div className={cn("grid gap-6", className)} {...props}>
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading authentication...
          </p>
        </div>
      </div>
    )
  }
  
  // 如果用户已登录，重定向到仪表板
  if (user) {
    redirect(`/${lang}/dashboard`)
  }

  */
}
