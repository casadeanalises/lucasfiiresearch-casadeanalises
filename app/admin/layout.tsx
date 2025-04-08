"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Menu Lateral */}
      <div className="w-64 bg-white shadow-lg">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold text-blue-900">Painel Admin</h2>
        </div>
        <nav className="mt-4">
          <Link
            href="/admin"
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-900 ${
              pathname === "/admin" ? "bg-blue-50 text-blue-900" : ""
            }`}
          >
            <span className="mr-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </span>
            Dashboard
          </Link>
          <Link
            href="/admin/reports"
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-900 ${
              pathname === "/admin/reports" ? "bg-blue-50 text-blue-900" : ""
            }`}
          >
            <span className="mr-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            Relatórios
          </Link>
          <Link
            href="/admin/home-videos"
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-900 ${
              pathname === "/admin/home-videos"
                ? "bg-blue-50 text-blue-900"
                : ""
            }`}
          >
            <span className="mr-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </span>
            Vídeos da Home
          </Link>
          <Link
            href="/admin/admins"
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-900 ${
              pathname === "/admin/admins" ? "bg-blue-50 text-blue-900" : ""
            }`}
          >
            <span className="mr-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>
            Gerenciar Admins
          </Link>
          {/* Botão de Logout */}
          <div className="mt-8 border-t pt-4">
            <Link
              href="/admin/fix-auth"
              className="mb-2 flex w-full items-center px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="mr-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              </span>
              Restaurar Autenticação
            </Link>

            <button
              onClick={async () => {
                try {
                  await fetch("/api/admin/logout", {
                    method: "POST",
                    credentials: "include",
                  });
                  window.location.href = "/admin/login";
                } catch (error) {
                  console.error("Erro ao fazer logout:", error);
                }
              }}
              className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <span className="mr-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              Sair
            </button>
          </div>
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1">
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-800">
                  Área Administrativa
                </h1>
              </div>
            </div>
          </div>
        </div>
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
