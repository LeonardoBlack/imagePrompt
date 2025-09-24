import Link from "next/link";
import { redirect } from "next/navigation";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";

import { UserAuthForm } from "~/components/user-auth-form";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default async function RegisterPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);
  
  // 重定向到Clerk注册页面以获得更好的注册体验
  redirect(`/${lang}/register-clerk`);
}
