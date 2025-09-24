"use client";

import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { cn } from "@saasfly/ui";
import { Button } from "@saasfly/ui/button";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import * as Icons from "@saasfly/ui/icons";
import { Eye, EyeOff } from "lucide-react";

interface UserClerkRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
  dict: any;
}

export function UserClerkRegisterForm({
  className,
  lang,
  dict,
  ...props
}: UserClerkRegisterFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signUp.create({
        emailAddress: email,
        password: password,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(`/${lang}/dashboard`);
      } else {
        // 需要邮箱验证
        router.push(`/${lang}/register-clerk/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: `/${lang}/dashboard`,
      });
    } catch (err) {
      setError("Google sign up failed");
    }
  };

  const handleGitHubSignUp = async () => {
    if (!isLoaded) return;
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: `/${lang}/dashboard`,
      });
    } catch (err) {
      setError("GitHub sign up failed");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20">
          {error}
        </div>
      )}
      
      {/* 邮箱注册表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {dict.email || "Email"}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={dict.email_placeholder || "Enter your email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            {dict.password || "Password"}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={dict.password_placeholder || "Create a password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-11 font-medium transition-all duration-200 hover:shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              {dict.creating_account || "Creating Account..."}
            </>
          ) : (
            dict.create_account || "Create Account"
          )}
        </Button>
      </form>

      {/* 分隔线 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/80 dark:bg-slate-900/80 px-2 text-muted-foreground backdrop-blur-sm">
            {dict.or_continue_with || "Or continue with"}
          </span>
        </div>
      </div>

      {/* 社交登录 */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          type="button" 
          className="h-11 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <Icons.Google className="mr-2 h-4 w-4" />
          Google
        </Button>
        
        <Button 
          variant="outline" 
          type="button" 
          className="h-11 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
          onClick={handleGitHubSignUp}
          disabled={isLoading}
        >
          <Icons.GitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}