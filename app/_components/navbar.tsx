"use client";

import { UserButton, SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  LogInIcon,
  Menu,
  X,
  ShieldCheck,
  BarChart3Icon,
  ArrowRightIcon,
} from "lucide-react";
import { toast } from "sonner";
import { MouseEvent, useState, useEffect, FormEvent, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { fiiService } from "@/app/services/fiiService";
import { FII } from "@/app/types/FII";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FII[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verifica se existe o cookie admin_token
    const hasAdminToken = document.cookie.includes("admin_token=");
    setIsAdmin(hasAdminToken);
  }, []);

  // Fechar o dropdown quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, []);

  // Função para buscar FIIs em tempo real
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setIsSearching(true);

      // Buscar os dados com um pequeno delay para evitar muitas chamadas
      const timer = setTimeout(async () => {
        try {
          // Usar o serviço para buscar FIIs correspondentes
          const results = await fiiService.searchFIIs(searchTerm);

          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error("Erro ao buscar FIIs:", error);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/fundlists?search=${encodeURIComponent(searchTerm)}`);
      setShowSearchResults(false);
    } else {
      router.push("/fundlists");
    }
  };

  const navigateToFII = (ticker: string) => {
    router.push(`/fundlists/${ticker}`);
    setSearchTerm("");
    setShowSearchResults(false);
  };

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
      <Link
        href="/fundlists"
        className={
          pathname === "/fundlists" || pathname.startsWith("/fundlists/")
            ? "flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition-all duration-200"
            : "flex items-center gap-2 rounded-lg px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-sm"
        }
        onClick={() => setIsOpen(false)}
      >
        <BarChart3Icon className="h-5 w-5" />
        FIIs
      </Link>

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

  // Se estiver na página de login admin, não mostra a navbar
  if (pathname === "/admin/login") return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-solid bg-white/80 backdrop-blur-md">
      {/* Layout Desktop (apenas telas grandes) */}
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-4">
        {/* Left side */}
        <div className="flex items-center gap-6">
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

          {/* <Link
            href="/fundlists"
            className={
              pathname === "/fundlists" || pathname.startsWith("/fundlists/")
                ? "flex items-center gap-2 font-medium text-blue-600"
                : "flex items-center gap-2 font-medium text-gray-600 hover:text-blue-600"
            }
          >
            <BarChart3Icon className="h-5 w-5" />
            Fundos Imobiliários
          </Link> */}
        </div>

        {/* Center - Search bar */}
        <div className="relative flex w-96" ref={searchRef}>
          <form onSubmit={handleSearch} className="w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Buscar FIIs por ticker ou nome..."
              className="w-full rounded-full border border-gray-200 bg-white pl-10 text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSearchResults(true);
                }
              }}
            />
          </form>

          {/* Dropdown de resultados da busca */}
          {showSearchResults && (
            <div className="absolute top-full mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
              {isSearching ? (
                <div className="flex items-center justify-center p-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <span className="ml-2 text-sm text-gray-600">
                    Buscando...
                  </span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Nenhum FII encontrado
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {searchResults.slice(0, 5).map((fii) => (
                      <div
                        key={fii.id}
                        className="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50"
                        onClick={() => navigateToFII(fii.ticker)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
                            <BarChart3Icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">
                                {fii.ticker}
                              </span>
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                                {fii.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{fii.name}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium">
                            R$ {fii.price.toFixed(2)}
                          </span>
                          <span
                            className={`flex items-center text-xs font-medium ${
                              fii.changePercent >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {fii.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {searchResults.length > 5 && (
                    <div
                      className="flex cursor-pointer items-center justify-center border-t border-gray-100 p-2"
                      onClick={() => {
                        router.push(
                          `/fundlists?search=${encodeURIComponent(searchTerm)}`,
                        );
                        setShowSearchResults(false);
                      }}
                    >
                      <span className="text-sm font-medium text-blue-600">
                        Ver mais resultados
                      </span>
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
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

    
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        {/* TODO: Hamburger menu disabled for now
        
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
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet> */}

        <div className="flex flex-1 items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt="Casa de Análises"
              priority
            />
            <span className="text-lg font-bold text-blue-600">Research</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
      
          <Link
            href="/fundlists"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          >
            <Search className="h-5 w-5 text-gray-500" />
          </Link>

          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={mobileTabletAppearance}
            />
          ) : (
            <SignInButton>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-[#1e3a8a] text-white hover:bg-[#1e3a8a]/90"
              >
                <LogInIcon className="h-5 w-5" />
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
