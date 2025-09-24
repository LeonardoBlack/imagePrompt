import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { AuthErrorBoundary } from "~/components/auth-error-boundary";
import { UserClerkRegisterForm } from "~/components/user-clerk-register-form";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your account to get started",
};

export default async function RegisterPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);
  
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-[50%] h-[500px] w-[500px] -translate-x-[50%] -translate-y-[50%] rounded-full bg-gradient-to-br from-blue-100/20 to-purple-100/20 blur-3xl dark:from-blue-900/20 dark:to-purple-900/20"></div>
      </div>
      
      <Link
        href={`/${lang}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8 z-10 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border border-border/50 hover:bg-white/90 dark:hover:bg-slate-900/90 transition-all duration-200"
        )}
      >
        <>
          <Icons.ChevronLeft className="mr-2 h-4 w-4" />
          {dict.login.back}
        </>
      </Link>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[450px] p-8">
        {/* 头部区域 */}
        <div className="flex flex-col space-y-6 text-center">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg"></div>
            <Image
              src="/images/avatars/saasfly-logo.svg"
              className="mx-auto h-20 w-20 relative"
              width="80"
              height="80"
              alt="Saasfly Logo"
              priority
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
              {dict.login.create_account || "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {dict.login.signup_title || "Sign up to get started with Saasfly"}
            </p>
          </div>
        </div>

        {/* 注册表单 */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm"></div>
          <div className="relative rounded-lg border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 shadow-lg">
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            }>
              <AuthErrorBoundary lang={lang}>
                <UserClerkRegisterForm lang={lang} dict={dict.login} />
              </AuthErrorBoundary>
            </Suspense>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            {dict.login.privacy || "By creating an account, you agree to our Terms of Service and Privacy Policy"}
          </p>
          <p className="text-sm text-muted-foreground">
            {dict.login.already_have_account || "Already have an account?"}
            <Link 
              href={`/${lang}/login-clerk`} 
              className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors ml-1"
            >
              {dict.login.signin || "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}