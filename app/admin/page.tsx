import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings2, FileText, Film } from "lucide-react";
import { Button } from "../_components/ui/button";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                Painel Administrativo
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie todos os aspectos do sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1: Gerenciar Relatórios */}
          <Link href="/admin/reports" className="group">
            <div className="flex h-full flex-col rounded-xl border border-blue-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                <Settings2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-800">
                Gerenciar Relatórios
              </h3>
              <p className="text-sm text-gray-500">
                Visualize, edite e exclua relatórios existentes.
              </p>
              <div className="mt-auto pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-between border border-gray-100 px-4 py-2 text-indigo-600 group-hover:bg-indigo-50"
                >
                  <span>Acessar</span>
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Link>

          {/* Card 2: Adicionar PDF */}
          <Link href="/admin/reports?add=pdf" className="group">
            <div className="flex h-full flex-col rounded-xl border border-blue-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-800">
                Adicionar PDF
              </h3>
              <p className="text-sm text-gray-500">
                Adicione novos relatórios em formato PDF para os assinantes.
              </p>
              <div className="mt-auto pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-between border border-gray-100 px-4 py-2 text-blue-600 group-hover:bg-blue-50"
                >
                  <span>Criar Novo</span>
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Link>

          {/* Card 3: Adicionar Vídeo */}
          <Link href="/admin/reports?add=video" className="group">
            <div className="flex h-full flex-col rounded-xl border border-blue-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-all group-hover:bg-purple-600 group-hover:text-white">
                <Film className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-800">
                Adicionar Vídeo
              </h3>
              <p className="text-sm text-gray-500">
                Publique novos vídeos de análises para sua audiência.
              </p>
              <div className="mt-auto pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-between border border-gray-100 px-4 py-2 text-purple-600 group-hover:bg-purple-50"
                >
                  <span>Criar Novo</span>
                  <Film className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
