"use client";

import React from "react";

interface PdfViewerContentProps {
  url: string;
  title: string;
}

const PdfViewerContent = ({ url, title }: PdfViewerContentProps) => {
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-2 shadow-md">
        <div className="text-md max-w-xs truncate font-medium text-gray-700">
          {title || "Visualizador de PDF"}
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
};

export default PdfViewerContent;
