import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { UserAuthForm } from "~/components/user-auth-form";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function LoginPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* 左侧 - 表单区域 */}
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <Link href={`/${lang}`} className="flex items-center space-x-2">
                <Image
                  src="/images/avatars/saasfly-logo.svg"
                  className="h-10 w-10"
                  width="40"
                  height="40"
                  alt="Saasfly Logo"
                  priority
                />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Saasfly</span>
              </Link>
            </div>

            {/* 标题 */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {dict.login.welcome_back || "Welcome back"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {dict.login.signin_title || "Sign in to your account to continue"}
              </p>
            </div>

            {/* 登录表单 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              }>
                <UserAuthForm lang={lang} dict={dict.login} />
              </Suspense>
            </div>

            {/* 底部链接 */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {dict.login.singup_title?.includes("?") ? 
                  dict.login.singup_title.split("?")[0] + "? " : 
                  "Don't have an account? "
                }
                <Link 
                  href={`/${lang}/register`} 
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  {dict.login.signup || "Sign up"}
                </Link>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {dict.login.privacy || "By signing in, you agree to our Terms of Service and Privacy Policy"}
              </p>
            </div>
          </div>
        </div>

        {/* 右侧 - 图片区域 */}
        <div className="hidden lg:block relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md px-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {dict.login.hero_title || "Welcome to Saasfly"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {dict.login.hero_description || "Experience the future of SaaS with our powerful, scalable, and user-friendly platform."}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 装饰性元素 */}
              <div className="flex justify-center space-x-4 mt-8">
                <div className="w-2 h-2 bg-blue-400/30 rounded-full"></div>
                <div className="w-2 h-2 bg-indigo-400/30 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-400/30 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* 背景装饰 */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
