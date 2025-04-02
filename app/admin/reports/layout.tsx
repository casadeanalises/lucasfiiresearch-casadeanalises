import Navbar from "@/app/_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-blue-900">
                Painel Administrativo
              </h1>
              <Link
                href="/reports"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ← Voltar para Relatórios
              </Link>
            </div>
            <div className="mt-4 flex space-x-4">
              <Link
                href="/admin/reports"
                className="border-b-2 border-blue-600 px-4 py-2 text-sm font-medium text-blue-800"
              >
                Gerenciar Conteúdo
              </Link>
              <Link
                href="/admin/reports?add=pdf"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-800"
              >
                Adicionar PDF
              </Link>
              <Link
                href="/admin/reports?add=video"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-800"
              >
                Adicionar Vídeo
              </Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">{children}</div>
      </div>
    </>
  );
}
