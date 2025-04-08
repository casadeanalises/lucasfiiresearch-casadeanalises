"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configurar o worker para o pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerContentProps {
  url: string;
  title: string;
}

const PdfViewerContent = ({ url, title }: PdfViewerContentProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<string | Uint8Array | null>(null);
  const [useBasicViewer, setUseBasicViewer] = useState<boolean>(false);

  // Verificar e ajustar a URL se necessário
  useEffect(() => {
    const processPdfUrl = async () => {
      try {
        // Tentar pré-carregar o PDF
        console.log("Tentando carregar PDF de:", url);

        // Verificar se a URL é válida
        const isValidUrl =
          url &&
          (url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("blob:") ||
            url.startsWith("data:"));

        if (!isValidUrl) {
          console.error("URL inválida:", url);
          setError(true);
          return;
        }

        // Primeira tentativa: Fetch com cabeçalhos CORS
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/pdf",
            },
            mode: "cors",
          });

          if (response.ok) {
            const pdfBlob = await response.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfFile(pdfUrl);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log("Falha ao carregar com CORS, tentando fallback:", error);
        }

        // Tentativa direta, sem processamento
        setPdfFile(url);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao processar URL do PDF:", error);
        setError(true);
        setLoading(false);
      }
    };

    processPdfUrl();

    // Cleanup
    return () => {
      if (typeof pdfFile === "string" && pdfFile.startsWith("blob:")) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("PDF carregado com sucesso, páginas:", numPages);
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Erro ao carregar PDF:", error);
    setLoading(false);
    setError(true);

    // Tentar usar o visualizador básico como fallback
    setUseBasicViewer(true);
  };

  const previousPage = () => {
    setPageNumber((prev) => (prev <= 1 ? prev : prev - 1));
  };

  const nextPage = () => {
    setPageNumber((prev) => (prev >= (numPages || 1) ? prev : prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  // Visualizador básico como fallback
  if (useBasicViewer) {
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

    return (
      <div className="flex h-full w-full flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-2 shadow-md">
          <div className="text-md max-w-xs truncate font-medium text-gray-700">
            {title || "Visualizador de PDF"} (Modo Compatibilidade)
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-white">
          <iframe
            src={googleDocsUrl}
            className="h-full w-full border-0"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Barra de controles */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-2 shadow-md">
        <div className="text-md max-w-xs truncate font-medium text-gray-700">
          {title || "Visualizador de PDF"}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="rounded-md bg-gray-100 p-1 text-gray-700 hover:bg-gray-200"
            title="Diminuir zoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12H9"
              />
            </svg>
          </button>

          <span className="text-sm">{Math.round(scale * 100)}%</span>

          <button
            onClick={zoomIn}
            className="rounded-md bg-gray-100 p-1 text-gray-700 hover:bg-gray-200"
            title="Aumentar zoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>

          <div className="mx-2 h-6 border-l border-gray-300"></div>

          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className={`rounded-md p-1 ${
              pageNumber <= 1
                ? "text-gray-400"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="Página anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-sm">
            {pageNumber} / {numPages || "?"}
          </span>

          <button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
            className={`rounded-md p-1 ${
              pageNumber >= (numPages || 1)
                ? "text-gray-400"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="Próxima página"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mx-2 h-6 border-l border-gray-300"></div>

          <button
            onClick={() => setUseBasicViewer(true)}
            className="rounded-md bg-gray-100 p-1 px-2 text-xs text-gray-700 hover:bg-gray-200"
            title="Mudar para modo de compatibilidade"
          >
            Modo compatibilidade
          </button>
        </div>
      </div>

      {/* Visualizador de PDF */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        {loading && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-2 text-sm text-gray-600">
                Carregando documento...
              </p>
            </div>
          </div>
        )}

        {error ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <p className="text-red-600">
                Não foi possível carregar o documento.
              </p>
              <p className="mt-1 text-sm text-red-500">
                Tente usar o modo de compatibilidade ou baixe o PDF.
              </p>
              <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  onClick={() => setUseBasicViewer(true)}
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Modo Compatibilidade
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                >
                  Baixar PDF
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            {pdfFile && (
              <Document
                file={pdfFile as string}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex h-60 w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                }
                className="shadow-lg"
                options={{
                  cMapUrl:
                    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.9.179/cmaps/",
                  cMapPacked: true,
                  standardFontDataUrl:
                    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.9.179/standard_fonts/",
                  withCredentials: true,
                }}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="rounded-md border border-gray-300 bg-white shadow-md"
                  loading={
                    <div className="flex h-60 w-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  }
                />
              </Document>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewerContent;
