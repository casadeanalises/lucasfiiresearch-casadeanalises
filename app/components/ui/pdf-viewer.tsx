"use client";

interface PdfViewerProps {
  url: string;
  title: string;
}

const PdfViewer = ({ url }: PdfViewerProps) => {
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className="relative h-full w-full">
      <iframe
        src={viewerUrl}
        className="h-full w-full rounded-lg border-0 bg-white"
        allow="fullscreen"
      />
    </div>
  );
};

export default PdfViewer;
