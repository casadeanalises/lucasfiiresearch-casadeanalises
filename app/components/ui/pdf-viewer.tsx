"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Importar o visualizador real do PDF dinamicamente para evitar erros de SSR
const PDFViewerContent = dynamic(() => import("./pdf-viewer-content"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-2 text-sm text-gray-600">
          Carregando visualizador de PDF...
        </p>
      </div>
    </div>
  ),
});

interface PdfViewerProps {
  url: string;
  title: string;
}

// Componente wrapper que é seguro para SSR
const PdfViewer = ({ url, title }: PdfViewerProps) => {
  return <PDFViewerContent url={url} title={title} />;
};

export default PdfViewer;
