"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import { toast } from "@saasfly/ui/use-toast";

type Dictionary = Record<string, string>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
  dict: Dictionary;
  disabled?: boolean;
}

const userAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({
  className,
  lang,
  dict,
  disabled,
  ...props
}: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [emailSent, setEmailSent] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const signInResult = await signIn("email", {
        email: data.email.toLowerCase(),
        redirect: false,
        callbackUrl: searchParams?.get("from") ?? `/${lang}/dashboard`,
      });

      if (!signInResult?.ok) {
        toast({
          title: dict.signin_error || "Something went wrong",
          description: dict.signin_error_desc || "Your sign in request failed. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setEmailSent(true);
      reset();
      toast({
        title: dict.check_email || "Check your email",
        description: dict.check_email_desc || "We sent you a login link. Be sure to check your spam too.",
      });
    } catch (error) {
      console.error("Error during sign in:", error);
      toast({
        title: dict.signin_error || "Something went wrong",
        description: dict.signin_error_desc || "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleGitHubSignIn() {
    setIsGitHubLoading(true);
    signIn("github", {
      callbackUrl: searchParams?.get("from") ?? `/${lang}/dashboard`,
    }).catch((error) => {
      console.error("GitHub signIn error:", error);
      toast({
        title: dict.github_error || "GitHub sign in failed",
        description: dict.github_error_desc || "Please try again or use email login",
        variant: "destructive",
      });
      setIsGitHubLoading(false);
    });
  }

  function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    signIn("google", {
      callbackUrl: searchParams?.get("from") ?? `/${lang}/dashboard`,
    }).catch((error) => {
      console.error("Google signIn error:", error);
      toast({
        title: dict.google_error || "Google sign in failed",
        description: dict.google_error_desc || "Please try again or use another login method",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    });
  }

  if (emailSent) {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-8 text-center border border-green-200 dark:border-green-800">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <Icons.Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
            {dict.email_sent || "Check your email"}
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-6">
            {dict.check_email || "We've sent you a login link. Please check your inbox and spam folder."}
          </p>
          <button
            onClick={() => setEmailSent(false)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
            )}
          >
            {dict.try_again || "Try a different email"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {dict.email_label || "Email address"}
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                placeholder={dict.email_placeholder || "Enter your email"}
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isGitHubLoading || isGoogleLoading || disabled}
                className="pl-10 h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                {...register("email")}
              />
            </div>
            {errors?.email && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          <button 
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 rounded-lg"
            )} 
            disabled={isLoading || isGoogleLoading || disabled}
          >
            {isLoading ? (
              <>
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                {dict.signing_in || "Signing in..."}
              </>
            ) : (
              dict.signin_email || "Sign in with Email"
            )}
          </button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-800 px-4 text-gray-500 dark:text-gray-400">
            {dict.signin_others || "Or continue with"}
          </span>
        </div>
      </div>
      
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all duration-200 rounded-lg"
        )}
        onClick={handleGitHubSignIn}
        disabled={isLoading || isGitHubLoading || isGoogleLoading || disabled}
      >
        {isGitHubLoading ? (
          <>
            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            {dict.connecting_google || "Connecting..."}
          </>
        ) : (
          <>
            <Icons.GitHub className="mr-2 h-5 w-5" />
            {dict.signin_google || "Continue with Google"}
          </>
        )}
      </button>
      
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all duration-200 rounded-lg"
        )}
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGitHubLoading || isGoogleLoading || disabled}
      >
        {isGoogleLoading ? (
          <>
            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            {dict.connecting_google || "Connecting..."}
          </>
        ) : (
          <>
            <Icons.Google className="mr-2 h-5 w-5" />
            {dict.signin_google || "Continue with Google"}
          </>
        )}
      </button>
    </div>
  );
}
