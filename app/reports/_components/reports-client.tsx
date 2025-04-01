"use client";

import { ScrollArea } from "../../_components/ui/scroll-area";
import LiveCard from "../../_components/ui/live-card";
import { useState } from "react";

interface LiveItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  videoId: string;
  isLive: boolean;
  tags: string[];
  author: {
    name: string;
    role: string;
  };
  stats?: {
    viewers?: number;
  };
  fiis?: Array<{
    code: string;
    dividendYield: string;
  }>;
}

interface ReportsClientProps {
  lives: LiveItem[];
}

const ReportsClient = ({ lives }: ReportsClientProps) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  // Helper function to play video in modal
  const playVideo = (videoId: string, title: string) => {
    setSelectedVideo(videoId);
    setSelectedTitle(title);
    setShowVideoModal(true);
  };

  return (
    <ScrollArea>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-4xl font-bold text-blue-900">
              Relatórios e Análises
            </h1>
            <p className="mx-auto max-w-2xl text-slate-600">
              Acesse os melhores relatórios e análises de FIIs para tomar
              decisões informadas em seus investimentos imobiliários.
            </p>
          </div>

          {/* Transmissões Anteriores section */}
          <h3 className="mb-4 mt-8 text-xl font-semibold text-blue-900">
            Transmissões Anteriores
          </h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lives.slice(1).map((live) => (
              <div
                key={live.id}
                className="cursor-pointer"
                onClick={() => playVideo(live.videoId, live.title)}
              >
                <LiveCard live={live} />
              </div>
            ))}
          </div>

          {/* Video Modal */}
          {showVideoModal && selectedVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/80"
                onClick={() => setShowVideoModal(false)}
              ></div>
              <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b bg-slate-50 p-4">
                  <h3 className="line-clamp-1 text-lg font-bold text-blue-900">
                    {selectedTitle}
                  </h3>
                  <button
                    onClick={() => setShowVideoModal(false)}
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
                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ReportsClient;
