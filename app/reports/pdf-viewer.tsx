"use client";

import { useEffect, useState } from "react";
import PDFViewer from "../_components/ui/pdf-viewer";
import { ChevronLeft, ChevronDown } from "lucide-react";
import Link from "next/link";

interface PDFViewerPageProps {
  id: string;
}

interface PDFData {
  id: number;
  title: string;
  description?: string;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  thumbnail: string;
  url?: string;
  fileContent?: string;
  premium: boolean;
  tags?: string;
  pageCount?: number;
  month: string;
  year: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export default function PDFViewerPage({
  params,
}: {
  params: PDFViewerPageProps;
}) {
  const { id } = params;
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reports/pdfs/${id}`);

        if (!response.ok) {
          throw new Error("Erro ao carregar o PDF");
        }

        const data = await response.json();
        setPdfData(data);
      } catch (err) {
        console.error("Erro ao buscar PDF:", err);
        setError(
          "Não foi possível carregar o PDF. Tente novamente mais tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPDF();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-lg text-gray-700">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (error || !pdfData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-8 text-center text-red-800">
          <p className="text-xl font-semibold">Erro</p>
          <p className="mt-2">{error || "PDF não encontrado"}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Extrair tags para array se existirem
  const tagsArray = pdfData.tags
    ? pdfData.tags.split(",").filter((tag) => tag.trim() !== "")
    : [];

  return (
    <div className="container mx-auto my-4 px-4">
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/reports"
            className="flex items-center text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-800"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar para Relatórios
          </Link>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-emerald-900">
            {pdfData.title}
          </h1>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mb-4 flex items-center text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800"
          >
            {showDetails ? "Ocultar detalhes" : "Mostrar detalhes"}
            <ChevronDown
              className={`ml-1 h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
            />
          </button>

          {showDetails && (
            <div className="mb-4 space-y-4 rounded-lg bg-white/70 p-4 backdrop-blur-sm">
              {pdfData.description && (
                <p className="text-gray-700">{pdfData.description}</p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-lg bg-white/80 p-3 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase text-gray-500">
                    Informações
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Autor:</span>
                      <span className="font-medium text-emerald-800">
                        {pdfData.author}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium">{pdfData.date}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Páginas:</span>
                      <span className="font-medium">
                        {pdfData.pageCount || "N/A"}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-white/80 p-3 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase text-gray-500">
                    Classificação
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Mês:</span>
                      <span className="font-medium">{pdfData.month}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Ano:</span>
                      <span className="font-medium">{pdfData.year}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium capitalize">
                        {pdfData.type}
                      </span>
                    </li>
                  </ul>
                </div>

                {tagsArray.length > 0 && (
                  <div className="rounded-lg bg-white/80 p-3 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase text-gray-500">
                      Tags
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tagsArray.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="h-[80vh] w-full">
          <PDFViewer
            fileUrl={
              pdfData.url ||
              `data:application/pdf;base64,${pdfData.fileContent}`
            }
          />
        </div>
      </div>
    </div>
  );
}
