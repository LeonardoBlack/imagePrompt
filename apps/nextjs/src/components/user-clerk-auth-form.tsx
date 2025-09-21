"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";

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
  const { user, isLoaded } = useUser()
  
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

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <SignIn 
        withSignUp={true} 
        fallbackRedirectUrl={`/${lang}/dashboard`}
        signUpFallbackRedirectUrl={`/${lang}/dashboard`}
        redirectUrl={`/${lang}/dashboard`}
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "border border-border rounded-lg shadow-sm",
            headerTitle: "text-xl font-semibold text-foreground",
            headerSubtitle: "text-sm text-muted-foreground",
            socialButtonsBlockButton: "border border-border hover:bg-accent hover:text-accent-foreground",
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            footerActionLink: "text-primary hover:text-primary/80",
            formFieldInput: "border border-input bg-background rounded-md px-3 py-2 text-sm",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground text-xs",
            identityPreviewText: "text-foreground",
            alternativeMethodsBlockButton: "border border-border hover:bg-accent",
            alternativeMethodsBlockButtonText: "text-foreground",
            backLink: "text-primary hover:text-primary/80",
          },
          layout: {
            socialButtonsPlacement: "bottom",
            socialButtonsVariant: "blockButton",
            helpPageUrl: `/${lang}/help`,
            privacyPageUrl: `/${lang}/privacy`,
            termsPageUrl: `/${lang}/terms`,
          },
          variables: {
            colorPrimary: "#000000",
            colorBackground: "#ffffff",
            colorText: "#000000",
            colorInputBackground: "#ffffff",
            colorInputText: "#000000",
            colorNeutral: "#6b7280",
            fontSize: "14px",
            borderRadius: "8px",
          }
        }}
      />
    </div>
  );
}
