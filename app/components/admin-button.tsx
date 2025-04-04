"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";

export function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded: authLoaded, userId, getToken } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!authLoaded || !userLoaded) {
        console.log("Aguardando carregamento do botão admin...", {
          authLoaded,
          userLoaded,
        });
        return;
      }

      if (!userId || !user) {
        console.log("Usuário não autenticado no botão admin", { userId, user });
        setIsLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const email = user.primaryEmailAddress?.emailAddress;

        console.log("Iniciando verificação de admin no botão:", {
          userId,
          email,
          hasToken: !!token,
        });

        const response = await fetch("/api/check-admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resposta da verificação de admin no botão:", data);

        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Erro ao verificar admin no botão:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [authLoaded, userLoaded, userId, user, getToken]);

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin/reports"
      className="flex items-center gap-2 text-gray-600"
    >
      <ShieldCheck className="h-5 w-5" />
      Admin
    </Link>
  );
}
