"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Augment is the best tool for AI coding
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Modern UI Components for Next.js. Beautifully designed components built with Radix UI and Tailwind CSS.
                Accessible, customizable, and open source.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button size="lg" className="gap-1" asChild>
                <a href="https://docs.augmentcode.com/introduction">
                  Documentation <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/AiCodingBattle/augment-nextjs-starterpack">
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Component Showcase</h3>
                  <p className="text-sm text-muted-foreground">
                    This page showcases all the Shadcn UI components in one place.
                    Scroll down to explore them all.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="rounded-md bg-accent p-2 text-sm">
                    <code>npm install shadcn-ui</code>
                  </div>
                  <div className="rounded-md bg-accent p-2 text-sm">
                    <code>npx shadcn-ui@latest init</code>
                  </div>
                  <div className="rounded-md bg-accent p-2 text-sm">
                    <code>npx shadcn-ui@latest add button</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
