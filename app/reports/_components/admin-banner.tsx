"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import AdminSection from "./admin-section";
import { Settings2 } from "lucide-react";

export default function AdminBanner() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (isSignedIn && user) {
        try {
          console.log("Verificando status de admin...");
          const response = await fetch("/api/check-admin");
          const data = await response.json();
          console.log("Resposta da verificação de admin:", data);
          setIsAdmin(data.isAdmin);
        } catch (error) {
          console.error("Erro ao verificar status de admin:", error);
          setIsAdmin(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("Usuário não autenticado, não é admin");
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [isSignedIn, user]);

  if (isLoading) {
    console.log("AdminBanner: Carregando estado de admin...");
    return (
      <div className="mb-10 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 shadow-sm">
        <div className="flex animate-pulse items-center justify-between bg-gradient-to-r from-blue-400/30 to-indigo-400/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200/50">
              <Settings2 className="h-4 w-4 text-blue-300/50" />
            </div>
            <div className="h-6 w-48 rounded bg-blue-200/50"></div>
          </div>
          <div className="h-8 w-24 rounded-md bg-blue-200/50"></div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex h-[200px] flex-col rounded-xl border border-blue-100 bg-white p-5"
              >
                <div className="mb-4 h-12 w-12 rounded-full bg-blue-100/50"></div>
                <div className="mb-2 h-6 w-3/4 rounded bg-gray-100"></div>
                <div className="mb-4 h-4 w-full rounded bg-gray-100"></div>
                <div className="mt-auto h-10 w-full rounded-md bg-gray-100"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log(
      "Usuário não é admin, mas exibindo AdminSection mesmo assim para teste",
    );
    // Descomente a linha abaixo para produção:
    // return null;
  }

  return <AdminSection />;
}
