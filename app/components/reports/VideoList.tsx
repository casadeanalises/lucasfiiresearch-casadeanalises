"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { PlayCircle, Clock, Calendar, User, X, TrendingUp } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string;
  videoId: string | null;
  author: string;
  date: string;
  time: string;
  premium: boolean;
  tags: string[];
  createdAt: string;
  type: string;
  dividendYield?: string;
  price?: string;
}

export function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/reports/videos");
        if (response.status === 403) {
          setError(
            "Você precisa ter um plano premium para acessar os vídeos. Assine agora!",
          );
          return;
        }
        if (!response.ok) {
          throw new Error("Erro ao carregar os vídeos");
        }
        const data = await response.json();

        // Processar os vídeos para garantir que a descrição está correta
        const processedVideos = data.map((video: Video) => {
          try {
            // Se a descrição for uma string JSON, tentar parsear
            if (video.description && video.description.startsWith("{")) {
              const parsedDesc = JSON.parse(video.description);
              return {
                ...video,
                description:
                  parsedDesc.description || "Sem descrição disponível",
                dividendYield: parsedDesc.dividendYield,
                price: parsedDesc.price,
              };
            }
            return video;
          } catch (e) {
            return video;
          }
        });

        setVideos(processedVideos);
      } catch (err) {
        console.error("Erro ao buscar vídeos:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-red-500">
        Erro: {error}
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        Nenhum vídeo encontrado.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card
            key={video.id}
            className="group cursor-pointer overflow-hidden bg-white transition-all hover:shadow-lg"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-video">
              <img
                src={
                  video.thumbnail ||
                  `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
                }
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle className="h-16 w-16 text-white" />
              </div>
              {video.premium && (
                <span className="absolute right-2 top-2 rounded-full bg-yellow-500 px-3 py-1 text-sm font-medium text-white shadow-lg">
                  Premium
                </span>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-lg text-gray-900">
                {video.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {video.description || "Sem descrição disponível"}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="truncate">{video.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{formatDate(video.createdAt)}</span>
                </div>
                {video.dividendYield && video.dividendYield !== "N/D" && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>DY: {video.dividendYield}</span>
                  </div>
                )}
              </div>
              {video.tags && video.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="h-[90vh] max-w-6xl overflow-hidden bg-white p-0">
          {selectedVideo && (
            <>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute right-4 top-4 z-50 rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-colors hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex h-full flex-col">
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                </div>
                <div className="flex-1 overflow-y-auto bg-white p-6">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {selectedVideo.title}
                    </DialogTitle>
                    <p className="mt-2 text-gray-600">
                      {selectedVideo.description || "Sem descrição disponível"}
                    </p>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-700">Autor:</span>
                      <span className="text-gray-600">
                        {selectedVideo.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-700">Data:</span>
                      <span className="text-gray-600">
                        {formatDate(selectedVideo.createdAt)}
                      </span>
                    </div>
                    {selectedVideo.dividendYield &&
                      selectedVideo.dividendYield !== "N/D" && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-700">DY:</span>
                          <span className="text-gray-600">
                            {selectedVideo.dividendYield}
                          </span>
                        </div>
                      )}
                  </div>
                  {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
