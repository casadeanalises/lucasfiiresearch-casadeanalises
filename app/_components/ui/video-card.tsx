"use client";

import { useState, useEffect, useRef } from "react";

interface VideoCardProps {
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
    videoId?: string;
    premium: boolean;
    tags: string[];
    dividendYield?: string;
    price?: string;
  };
}

const VideoCard = ({ report }: VideoCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);

  // Gerar a URL do thumbnail do YouTube
  useEffect(() => {
    const videoId = report.videoId || "";
    const thumbnailUrl =
      report.thumbnail ||
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    setImageUrl(thumbnailUrl);
  }, [report.thumbnail, report.videoId]);

  // Função para lidar com erros de carregamento de imagem
  const handleImageError = () => {
    const videoId = report.videoId || "";
    setImageUrl(`https://img.youtube.com/vi/${videoId}/0.jpg`);
  };

  return (
    <>
      <div className="transform overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative">
          <div className="relative aspect-video bg-gray-200">
            {/* Thumbnail real do vídeo */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt={report.title}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                <div
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-600 transition-colors hover:bg-red-700"
                  onClick={() => setShowModal(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                  >
                    <path d="M8 5v14l11-7z" />
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
            <div>
              {report.dividendYield && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">
                    DY Mensal
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {report.dividendYield}
                  </span>
                </div>
              )}
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

      {/* Modal de Vídeo melhorado */}
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
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${report.videoId}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
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
                  <a
                    href={`https://www.youtube.com/watch?v=${report.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center text-sm text-blue-600 hover:text-blue-800"
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Ver no YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
