"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-8 h-8 overflow-hidden rounded-full">
              <Image
                src="/logo.png"
                alt="Augment Logo"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">
              Augment Next.js Starter
            </span>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <ListItem href="#inputs" title="Inputs">
                        Form controls and input components
                      </ListItem>
                      <ListItem href="#display" title="Display">
                        Components for displaying content
                      </ListItem>
                      <ListItem href="#layout" title="Layout">
                        Components for layout and structure
                      </ListItem>
                      <ListItem href="#navigation" title="Navigation">
                        Components for navigation and menus
                      </ListItem>
                      <ListItem href="#feedback" title="Feedback">
                        Components for user feedback
                      </ListItem>
                      <ListItem href="#data-display" title="Data Display">
                        Components for displaying data
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="https://www.augmentcode.com/jay" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Documentation
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="https://discord.gg/sDQyM7N6t8" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Discord Community
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
        
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[380px] p-0 bg-background">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <div className="p-6 bg-background border-b">
                    <Link href="/" className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-sm">
                        <Image
                          src="/logo.png"
                          alt="Augment Logo"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-xl">Starter Pack</span>
                    </Link>
                  </div>

                  <div className="flex-1 px-6 py-8 overflow-auto bg-background">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-4 pl-4">COMPONENTS</h4>
                        <nav className="space-y-1">
                          {[
                            { href: "#inputs", label: "Inputs" },
                            { href: "#display", label: "Display" },
                            { href: "#layout", label: "Layout" },
                            { href: "#navigation", label: "Navigation" },
                            { href: "#feedback", label: "Feedback" },
                            { href: "#data-display", label: "Data Display" }
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeSheet}
                              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors bg-background border hover:bg-accent hover:text-accent-foreground"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </nav>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-4 pl-4">RESOURCES</h4>
                        <nav className="space-y-1">
                          <Link
                            href="https://docs.augmentcode.com/introduction"
                            onClick={closeSheet}
                            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors bg-background border hover:bg-accent hover:text-accent-foreground"
                          >
                            Documentation
                          </Link>
                          <Link
                            href="https://discord.gg/sDQyM7N6t8"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeSheet}
                            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors bg-background border hover:bg-accent hover:text-accent-foreground"
                          >
                            Discord Community
                          </Link>
                          <Link
                            href="/login"
                            onClick={closeSheet}
                            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors bg-background border hover:bg-accent hover:text-accent-foreground"
                          >
                            Login
                          </Link>
                          <Link
                            href="/register"
                            onClick={closeSheet}
                            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors bg-background border hover:bg-accent hover:text-accent-foreground"
                          >
                            Register
                          </Link>
                        </nav>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-background border-t">
                    <div className="flex flex-col gap-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href="/register" onClick={closeSheet}>Get Started</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login" onClick={closeSheet}>Login</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
})
ListItem.displayName = "ListItem";
