'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { SearchBar } from '@/components/books/search-bar';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BookOpen, Home, PlusCircle, Search, Database, BarChart3, Menu, X, Smartphone } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  // Define navigation links
  const navLinks = [
    {
      href: '/',
      label: 'Home',
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      href: '/books',
      label: 'My Books',
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
    {
      href: '/books/add',
      label: 'Add Book',
      icon: <PlusCircle className="h-4 w-4 mr-2" />,
    },
    {
      href: '/books/search',
      label: 'Search',
      icon: <Search className="h-4 w-4 mr-2" />,
      hideOnMobile: true,
    },
    {
      href: '/books/statistics',
      label: 'Statistics',
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      hideOnMobile: true,
    },
    {
      href: '/books/manage',
      label: 'Manage Data',
      icon: <Database className="h-4 w-4 mr-2" />,
      hideOnMobile: true,
    },
    {
      href: '/responsive-test',
      label: 'Test Responsive',
      icon: <Smartphone className="h-4 w-4 mr-2" />,
      hideOnMobile: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">Bookshelf</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center ml-6 space-x-2">
            {navLinks.filter(link => !link.hideOnMobile).map((link) => (
              <Button
                key={link.href}
                variant={pathname === link.href ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link href={link.href}>
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block mr-2">
            <SearchBar />
          </div>

          {/* Desktop Additional Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.filter(link => link.hideOnMobile).map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href={link.href}>
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>

          <ModeToggle />

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle className="flex items-center">
                  <BookOpen className="h-6 w-6 mr-2" />
                  <span>Bookshelf</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant={pathname === link.href ? 'default' : 'ghost'}
                    size="sm"
                    className="justify-start"
                    asChild
                    onClick={closeMenu}
                  >
                    <Link href={link.href}>
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </Button>
                ))}
                <div className="pt-4 mt-4 border-t">
                  <SearchBar className="mb-4" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
