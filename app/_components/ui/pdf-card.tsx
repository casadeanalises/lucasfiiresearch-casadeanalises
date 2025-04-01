"use client";

import { useState, useEffect, useRef } from "react";

interface PDFCardProps {
  report: {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    time: string;
    code: string;
    type: string;
    thumbnail: string;
    url: string;
    premium: boolean;
    tags: string[];
    pageCount: number;
  };
}

const PDFCard = ({ report }: PDFCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);

  // Usar o thumbnail fornecido ou um placeholder
  useEffect(() => {
    const thumbnailUrl = report.thumbnail || "/reports/pdf-placeholder.jpg";
    setImageUrl(thumbnailUrl);
  }, [report.thumbnail]);

  // Função para lidar com erros de carregamento de imagem
  const handleImageError = () => {
    setImageUrl("/reports/pdf-placeholder.jpg");
  };

  return (
    <>
      <div className="transform overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative">
          <div className="relative aspect-[3/4] bg-gray-200">
            {/* Thumbnail do PDF */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt={report.title}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform hover:scale-110"
                onClick={() => setShowModal(true)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 transition-colors hover:bg-blue-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute left-0 top-0 w-full bg-gradient-to-b from-black/70 to-transparent px-4 py-2">
            <h3 className="text-sm font-bold text-white">{report.title}</h3>
          </div>
          {report.premium && (
            <div className="absolute right-2 top-2">
              <button className="rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:from-green-500 hover:to-emerald-400">
                PREMIUM
              </button>
            </div>
          )}
          {/* Tag de código do FII */}
          {report.code !== "N/D" && (
            <div className="absolute bottom-2 left-2">
              <span className="rounded bg-blue-800/80 px-2 py-1 text-xs font-bold text-white">
                {report.code}
              </span>
            </div>
          )}
          {/* Badge de páginas */}
          <div className="absolute bottom-2 right-2">
            <span className="rounded-full bg-gray-900/80 px-2 py-1 text-xs font-bold text-white">
              {report.pageCount} páginas
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {report.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-gray-700">
            {report.description}
          </p>
          <div className="mb-3 flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
              {report.author.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Autor</p>
              <p className="text-sm font-semibold">{report.author}</p>
            </div>
          </div>
          <div className="flex justify-between border-t pt-3 text-xs text-gray-500">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Páginas</span>
              <span className="text-sm font-bold text-blue-900">
                {report.pageCount}
              </span>
            </div>
            <div className="flex items-center">
              <span>{report.date}</span>
              <button
                className="ml-2 rounded-full bg-blue-50 p-1 text-blue-800 transition-colors hover:bg-blue-100"
                onClick={() => setShowModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a7 7 0 1014 0 7 7 0 00-14 0zm6.293-4.707a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L10.586 8 8.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de PDF melhorado */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b bg-slate-50 p-4">
              <h3 className="line-clamp-1 text-lg font-bold text-blue-900">
                {report.title}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full bg-gray-200 p-1 transition-colors hover:bg-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="h-[70vh] w-full">
              <iframe
                src={`${report.url}#toolbar=0`}
                className="h-full w-full"
                title={`PDF: ${report.title}`}
              ></iframe>
            </div>
            <div className="bg-white p-4">
              <div className="mb-2 flex flex-wrap gap-2">
                {report.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-700">{report.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
                    {report.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{report.author}</p>
                    <p className="text-sm text-gray-500">Analista de FIIs</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-gray-500">
                    Publicado em {report.date}
                  </p>
                  <div className="mt-1 flex gap-2">
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </a>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      Compartilhar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFCard;
