"use client";

import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogInIcon, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { MouseEvent, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

const Navbar = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const desktopAppearance = {
    elements: {
      avatarBox: "w-9 h-9",
      userButtonBox: "flex items-center gap-2",
      userButtonOuterIdentifier: "text-secondary font-medium",
      userButtonTrigger:
        "focus:shadow-none focus:ring-2 focus:ring-primary/20 hover:opacity-80 transition-opacity",
      userButtonPopoverCard: "shadow-lg border border-gray-100 !w-[240px]",
      userButtonPopoverActions: "p-2 flex flex-col gap-1",
      userButtonPopoverActionButton:
        "flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 text-sm font-medium transition-colors",
      userButtonPopoverActionButtonText: "text-secondary",
      userButtonPopoverActionButtonIcon: "w-4 h-4 text-secondary",
    },
    layout: {
      shimmer: false,
    },
  };

  const mobileTabletAppearance = {
    elements: {
      avatarBox: "w-9 h-9",
      userButtonBox: "flex items-center gap-2",
      userButtonOuterIdentifier: "hidden",
      userButtonTrigger:
        "focus:shadow-none focus:ring-2 focus:ring-primary/20 hover:opacity-80 transition-opacity",
      userButtonPopoverCard:
        "!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[240px] shadow-lg border border-gray-100 !z-[100]",
      userButtonPopoverActions: "p-2 flex flex-col gap-1",
      userButtonPopoverActionButton:
        "flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 text-sm font-medium transition-colors",
      userButtonPopoverActionButtonText: "text-secondary",
      userButtonPopoverActionButtonIcon: "w-4 h-4 text-secondary",
    },
    layout: {
      shimmer: false,
    },
  };

  const handleRestrictedLink = (
    e: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (!isSignedIn) {
      e.preventDefault();

      if (path === "/dashboard" || path === "/reports") {
        toast.error(
          "Você deve logar e assinar o plano para acessar esta funcionalidade.",
        );
      } else {
        toast.error("Faça login para acessar esta página");
      }
    }
    setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={
          pathname === "/"
            ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
            : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
        }
        onClick={() => setIsOpen(false)}
      >
        Início
      </Link>

      <Link
        href="/subscription"
        className={
          pathname === "/subscription"
            ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
            : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
        }
        onClick={(e) => handleRestrictedLink(e, "/subscription")}
      >
        Assinatura
      </Link>

      <Link
        href="/reports"
        className={
          pathname === "/reports"
            ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
            : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
        }
        onClick={(e) => handleRestrictedLink(e, "/reports")}
      >
        Relatórios
      </Link>

      <Link
        href="/dashboard"
        className={
          pathname === "/dashboard"
            ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
            : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
        }
        onClick={(e) => handleRestrictedLink(e, "/dashboard")}
      >
        Dashboard
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-solid bg-white/80 backdrop-blur-md">
      {/* Layout Desktop (apenas telas grandes) */}
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              width={50}
              height={50}
              alt="Casa de Análises"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <NavLinks />
          </div>
        </div>

        <div>
          {isSignedIn ? (
            <UserButton
              showName
              afterSignOutUrl="/"
              appearance={desktopAppearance}
            />
          ) : (
            <SignInButton>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <LogInIcon className="mr-2 h-4 w-4" />
                <span>Entrar</span>
              </Button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Layout Mobile e Tablet */}
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Menu className="h-6 w-6 text-secondary" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 border-r border-blue-100 bg-gradient-to-br from-white to-blue-50 p-0"
          >
            <SheetHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <SheetTitle className="text-left text-lg font-bold text-white">
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 p-4">
              <Link
                href="/"
                className={
                  pathname === "/"
                    ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
                    : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
                }
                onClick={() => setIsOpen(false)}
              >
                Início
              </Link>

              <Link
                href="/subscription"
                className={
                  pathname === "/subscription"
                    ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
                    : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
                }
                onClick={(e) => handleRestrictedLink(e, "/subscription")}
              >
                Assinatura
              </Link>

              <Link
                href="/reports"
                className={
                  pathname === "/reports"
                    ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
                    : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
                }
                onClick={(e) => handleRestrictedLink(e, "/reports")}
              >
                Relatórios
              </Link>

              <Link
                href="/dashboard"
                className={
                  pathname === "/dashboard"
                    ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
                    : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
                }
                onClick={(e) => handleRestrictedLink(e, "/dashboard")}
              >
                Dashboard
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Image
            src="/logo.png"
            width={50}
            height={50}
            alt="Casa de Análises"
            priority
          />
        </Link>

        <div className="relative">
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={mobileTabletAppearance}
            />
          ) : (
            <SignInButton>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary/10"
              >
                <LogInIcon className="h-6 w-6 text-secondary" />
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
