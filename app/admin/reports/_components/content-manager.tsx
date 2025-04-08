"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { X } from "lucide-react";
import PdfViewer from "../../../components/ui/pdf-viewer";

interface Report {
  id: string;
  title: string;
  description: string | null;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  thumbnail: string;
  premium: boolean;
  tags: string[];
  month: string;
  year: string;
  videoId?: string | null;
  url?: string | null;
  pageCount?: number | null;
  dividendYield?: string | null;
  price?: string | null;
  createdAt: string;
}

interface ContentManagerProps {
  activeTab: "pdf" | "video";
  onEdit: (item: Report) => void;
  onSetAddMode: () => void;
}

const ContentManager: React.FC<ContentManagerProps> = ({
  activeTab,
  onEdit,
  onSetAddMode,
}) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPdf, setSelectedPdf] = useState<Report | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const url =
          activeTab === "pdf" ? "/api/reports/pdfs" : "/api/reports/videos";

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Falha ao carregar itens");
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);
        setItems(data);
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
        toast.error("Erro ao carregar itens");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [activeTab]);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) {
      return;
    }

    try {
      const url =
        activeTab === "pdf"
          ? `/api/reports/pdfs/${id}`
          : `/api/reports/videos/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir item");
      }

      setItems(items.filter((item) => item.id !== id));
      toast.success(
        `${activeTab === "pdf" ? "PDF" : "Vídeo"} excluído com sucesso!`,
        {
          duration: 4000,
          icon: activeTab === "pdf" ? "📄" : "🎥",
          style: {
            background: "#4CAF50",
            color: "#fff",
          },
        },
      );
    } catch (error) {
      console.error(
        `Erro ao excluir ${activeTab === "pdf" ? "PDF" : "vídeo"}:`,
        error,
      );
      toast.error(`Erro ao excluir ${activeTab === "pdf" ? "PDF" : "vídeo"}`, {
        duration: 4000,
        icon: "❌",
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-800">
          Gerenciar {activeTab === "pdf" ? "PDFs" : "Vídeos"}
        </h3>
        <button
          onClick={onSetAddMode}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
        >
          Adicionar Novo
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por título, descrição ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <svg
            className="h-8 w-8 animate-spin text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <>
          {filteredItems.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                {searchTerm
                  ? "Nenhum item encontrado para esta busca."
                  : `Nenhum ${activeTab === "pdf" ? "PDF" : "vídeo"} cadastrado.`}
              </p>
              <button
                onClick={onSetAddMode}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Adicionar Novo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Título
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Autor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Premium
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div
                          className={`text-sm font-medium ${activeTab === "pdf" ? "cursor-pointer text-blue-600 hover:text-blue-800" : "text-gray-900"}`}
                          onClick={() =>
                            activeTab === "pdf" &&
                            item.url &&
                            setSelectedPdf(item)
                          }
                        >
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.description}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {item.author}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {item.premium ? "Sim" : "Não"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <button
                          onClick={() => onEdit(item)}
                          className="mr-2 text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <Dialog open={!!selectedPdf} onOpenChange={() => setSelectedPdf(null)}>
        <DialogContent className="h-[80vh] max-w-4xl p-0">
          <button
            onClick={() => setSelectedPdf(null)}
            className="absolute right-4 top-4 z-50 rounded-full bg-white p-2 text-gray-700 shadow-md transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
          {selectedPdf && selectedPdf.url && (
            <PdfViewer url={selectedPdf.url} title={selectedPdf.title} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManager;
