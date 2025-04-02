"use client";

import { Button } from "../../_components/ui/button";
import {
  PlusCircle,
  Settings2,
  FileEdit,
  FileText,
  Film,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-10 overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm transition-all duration-300">
      {/* Cabeçalho sempre visível */}
      <div
        className="flex cursor-pointer items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Área Administrativa</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="text-white hover:bg-white/20"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Conteúdo expansível */}
      <div
        className={`transform transition-all duration-300 ease-in-out ${
          expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Card 1: Gerenciar Relatórios */}
            <Link href="/admin/reports" className="group">
              <div className="flex h-full flex-col rounded-xl border border-blue-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md">
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
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>

            {/* Card 2: Adicionar PDF */}
            <Link href="/admin/reports?add=pdf" className="group">
              <div className="flex h-full flex-col rounded-xl border border-blue-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md">
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
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>

            {/* Card 3: Adicionar Vídeo */}
            <Link href="/admin/reports?add=video" className="group">
              <div className="flex h-full flex-col rounded-xl border border-blue-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md">
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
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
