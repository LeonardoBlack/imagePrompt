"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
  lang: string;
}

export function AuthErrorBoundary({ children, lang }: AuthErrorBoundaryProps) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const router = useRouter();

  const handleRetry = () => {
    setHasError(false);
    setError(null);
    router.refresh();
  };

  const handleGoHome = () => {
    router.push(`/${lang}`);
  };

  // 简化的错误处理
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-center mb-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              Authentication Error
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm">
              {error?.message || "An unexpected error occurred during authentication. Please try again."}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-md transition-colors"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}