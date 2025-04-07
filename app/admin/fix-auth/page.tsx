"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FixAuthPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const router = useRouter();

  const handleResetAuth = async () => {
    try {
      setLoading(true);
      setMessage("Limpando cookies antigos...");

      // Primeiro faz logout para limpar qualquer cookie existente
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      setMessage("Realizando novo login...");

      // Tenta fazer login com as credenciais fornecidas
      const loginResponse = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Erro ao fazer login");
      }

      setMessage("Login realizado com sucesso! Redirecionando...");

      // Redireciona para a página de administradores
      setTimeout(() => {
        router.push("/admin/admins");
      }, 2000);
    } catch (error: any) {
      setMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-8">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Restaurar Autenticação
        </h1>
        <p className="mb-6 text-gray-600">
          Esta página ajuda a resolver problemas de autenticação. Informe suas
          credenciais de administrador para obter um novo token válido.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email do Administrador
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full rounded-md border p-2 shadow-sm"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full rounded-md border p-2 shadow-sm"
              placeholder="Sua senha"
            />
          </div>

          <button
            onClick={handleResetAuth}
            disabled={loading || !adminEmail || !adminPassword}
            className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processando..." : "Restaurar Autenticação"}
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 rounded-md ${message.includes("Erro") ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"} p-3`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-500">
        Após restaurar a autenticação, você poderá gerenciar administradores
        normalmente.
      </div>
    </div>
  );
}
