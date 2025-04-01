"use client";

import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogInIcon } from "lucide-react";
import { toast } from "sonner";
import { MouseEvent } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

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
  };

  return (
    <nav className="flex justify-between border-b border-solid px-8 py-4">
      {/* ESQUERDA */}
      <div className="flex items-center gap-10">
        <Link href="/">
          <Image src="/logo.png" width={50} height={50} alt="Finance AI" />
        </Link>

        <Link
          href="/"
          className={
            pathname === "/"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Início
        </Link>

        <Link
          href="/subscription"
          className={
            pathname === "/subscription"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
          onClick={(e) => handleRestrictedLink(e, "/subscription")}
        >
          Assinatura
        </Link>

        <Link
          href="/reports"
          className={
            pathname === "/reports"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
          onClick={(e) => handleRestrictedLink(e, "/reports")}
        >
          Relatórios
        </Link>

        <Link
          href="/dashboard"
          className={
            pathname === "/dashboard"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
          onClick={(e) => handleRestrictedLink(e, "/dashboard")}
        >
          Dashboard
        </Link>
      </div>
      {/* DIREITA */}
      {isSignedIn ? (
        <UserButton showName />
      ) : (
        <SignInButton>
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            <LogInIcon className="mr-2 h-4 w-4" />
            Entrar
          </Button>
        </SignInButton>
      )}
    </nav>
  );
};

export default Navbar;
