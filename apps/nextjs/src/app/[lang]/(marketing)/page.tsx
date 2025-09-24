import { Suspense } from "react";
import type { Metadata } from "next";
import { getScopedI18n } from "~/lib/i18n/server";
import { getDictionary } from "~/lib/get-dictionary";
import { Button } from "@saasfly/ui/button";
import { cn } from "@saasfly/ui";
import { Icons } from "~/components/icons";
import { AnimatedGradientText } from "@saasfly/ui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
// import { Contributors } from "~/components/contributors";
// import { MarketingRight } from "~/components/marketing-right";
import { FeaturesGrid } from "~/components/features-grid";
// import { Sponsors } from "~/components/sponsors";
// import { VideoScroll } from "~/components/video-scroll";
// import { Comments } from "~/components/comments";
import { AIToolHero } from "~/components/ai-tool-hero";

const people = [
  {
    id: 1,
    name: "tianzx",
    designation: "CEO at Nextify",
    image: "https://avatars.githubusercontent.com/u/10096899",
    link: "https://x.com/nextify2024",
  },
  {
    id: 2,
    name: "jackc3",
    designation: "Co-founder at Nextify",
    image: "https://avatars.githubusercontent.com/u/10334353",
    link: "https://x.com/BingxunYao",
  },
  {
    id: 3,
    name: "imesong",
    designation: "Contributor",
    image: "https://avatars.githubusercontent.com/u/3849293",
  },
  {
    id: 4,
    name: "ziveen",
    designation: "Contributor",
    image: "https://avatars.githubusercontent.com/u/22560152",
  },
  {
    id: 5,
    name: "Zenuncl",
    designation: "Independent Software Developer",
    image: "https://avatars.githubusercontent.com/u/3316062",
  },
  {
    id: 6,
    name: "Innei",
    designation: "Indie Developer",
    image: "https://avatars.githubusercontent.com/u/41265413",
  },
];

export default async function IndexPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 opacity-50" />
      <section className="container relative mx-auto grid items-center gap-8 pb-8 pt-6 md:py-10">
        {/* AI工具落地页面 */}
        <div className="mx-auto max-w-[1200px] py-8 w-full">
          <AIToolHero />
        </div>
        <div className="mx-auto max-w-[1200px] py-8">
          {/* <Contributors /> */}
        </div>
        <div className="mx-auto max-w-[1200px] py-8">
          {/* <MarketingRight /> */}
        </div>
        <div className="mx-auto max-w-[1200px] py-8">
          <FeaturesGrid />
        </div>
        <div className="mx-auto max-w-[1200px] py-8">
          {/* <Sponsors /> */}
        </div>
        <div className="mx-auto max-w-[1200px] py-8">
          {/* <VideoScroll /> */}
        </div>
        <div className="mx-auto max-w-[1200px] py-8">
          {/* <Comments /> */}
        </div>
      </section>
    </div>
  );
}
