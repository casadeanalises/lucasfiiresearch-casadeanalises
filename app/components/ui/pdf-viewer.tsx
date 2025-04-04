"use client";

import { useState } from "react";

interface PdfViewerProps {
  url: string;
  title: string;
}

const PdfViewer = ({ url }: PdfViewerProps) => {
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);

  // Tentar primeiro com o PDF.js viewer, se falhar, usar o Google Docs viewer
  const pdfJsUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`;
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  const viewerUrl = useGoogleViewer ? googleDocsUrl : pdfJsUrl;

  return (
    <div className="relative h-full w-full">
      <iframe
        src={viewerUrl}
        className="h-full w-full rounded-lg border-0"
        onError={() => setUseGoogleViewer(true)}
        allow="fullscreen"
      />
      {/* Botão para alternar entre visualizadores */}
      <button
        onClick={() => setUseGoogleViewer(!useGoogleViewer)}
        className="absolute bottom-4 right-4 rounded-lg bg-primary px-4 py-2 text-white shadow-lg transition-colors hover:bg-primary/90"
      >
        {useGoogleViewer ? "Usar PDF.js" : "Usar Google Docs"}
      </button>
    </div>
  );
};

export default PdfViewer;
