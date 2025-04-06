"use client";

import { UserButton, SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogInIcon, Menu, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { MouseEvent, useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

const Navbar = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch("/api/check-admin");
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } catch (error) {
          console.error("Erro ao verificar status de admin:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [isSignedIn, user]);

  const desktopAppearance = {
    elements: {
      avatarBox: "w-9 h-9",
      userButtonBox: "flex items-center gap-2",
      userButtonOuterIdentifier: "text-gray-700 font-medium",
      userButtonTrigger:
        "focus:shadow-none focus:ring-2 focus:ring-primary/20 hover:opacity-80 transition-opacity",
      userButtonPopoverCard: "shadow-lg border border-gray-100 !w-[240px]",
      userButtonPopoverActions: "p-2 flex flex-col gap-1",
      userButtonPopoverActionButton:
        "flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 text-sm font-medium transition-colors",
      userButtonPopoverActionButtonText: "text-gray-700",
      userButtonPopoverActionButtonIcon: "w-4 h-4 text-gray-700",
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
      userButtonPopoverActionButtonText: "text-gray-700",
      userButtonPopoverActionButtonIcon: "w-4 h-4 text-gray-700",
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
      {/* <Link
        href="/"
        className={
          pathname === "/"
            ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
            : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
        }
        onClick={() => setIsOpen(false)}
      >
        Início
      </Link> */}

      {/* <Link
        href="/subscription"
        className={
          pathname === "/subscription"
            ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
            : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
        }
        onClick={(e) => handleRestrictedLink(e, "/subscription")}
      >
        Assinatura
      </Link> */}

      {/* <Link
        href="/reports"
        className={
          pathname === "/reports"
            ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
            : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
        }
        onClick={(e) => handleRestrictedLink(e, "/reports")}
      >
        Relatórios
      </Link> */}

      {/* <Link
        href="/dashboard"
        className={
          pathname === "/dashboard"
            ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
            : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
        }
        onClick={(e) => handleRestrictedLink(e, "/dashboard")}
      >
        Dashboard
      </Link> */}

      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2 text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          <ShieldCheck className="h-5 w-5" />
          Admin
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-solid bg-white/80 backdrop-blur-md">
      {/* Layout Desktop (apenas telas grandes) */}
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-4">
        {/* Left side */}
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                width={50}
                height={50}
                alt="Casa de Análises"
                priority
              />
            </Link>
            <Link href="/">
              <span className="text-xl font-bold text-blue-600">Research</span>
            </Link>
          </div>
        </div>

        {/* Center - Search bar */}
        <div className="relative flex w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Busca de fundos"
            className="w-full rounded-full border border-gray-200 bg-white pl-10 text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link
            href={isSignedIn ? "/subscription" : "/"}
            onClick={(e) => {
              if (!isSignedIn) {
                e.preventDefault();
                toast.error(
                  "Faça login ou cadastre-se para acessar esta funcionalidade",
                );
              }
            }}
          >
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              <LogInIcon className="mr-2 h-4 w-4" />
              Assine já
            </Button>
          </Link>

          {isSignedIn ? (
            <UserButton
              showName
              afterSignOutUrl="/"
              appearance={desktopAppearance}
            />
          ) : (
            <SignInButton>
              <Button className="bg-[#1e3a8a] text-white hover:bg-[#1e3a8a]/90">
                <LogInIcon className="mr-2 h-4 w-4" />
                <span>Entrar</span>
              </Button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* === Layout Mobile e Tablet === */}

      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Menu className="h-6 w-6 text-gray-700" />
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
              {/* <Link
                href="/"
                className={
                  pathname === "/"
                    ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
                    : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
                }
                onClick={() => setIsOpen(false)}
              >
                Início
              </Link> */}

              {/* <Link
                href="/subscription"
                className={
                  pathname === "/subscription"
                    ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
                    : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
                }
                onClick={(e) => handleRestrictedLink(e, "/subscription")}
              >
                Assinatura
              </Link> */}

              {/* <Link
                href="/reports"
                className={
                  pathname === "/reports"
                    ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
                    : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
                }
                onClick={(e) => handleRestrictedLink(e, "/reports")}
              >
                Relatórios
              </Link> */}

              {/* <Link
                href="/dashboard"
                className={
                  pathname === "/dashboard"
                    ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
                    : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
                }
                onClick={(e) => handleRestrictedLink(e, "/dashboard")}
              >
                Dashboard
              </Link> */}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  <ShieldCheck className="h-5 w-5" />
                  Admin
                </Link>
              )}
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
