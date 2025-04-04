"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  PlayCircle,
  Clock,
  Calendar,
  User,
  X,
  TrendingUp,
  Search,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("todos");
  const [selectedMonth, setSelectedMonth] = useState<string>("todos");

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

        const processedVideos = data.map((video: Video) => {
          try {
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

  const filteredVideos = videos.filter((video) => {
    const videoDate = new Date(video.createdAt);
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      selectedYear === "todos" ||
      videoDate.getFullYear().toString() === selectedYear;
    const matchesMonth =
      selectedMonth === "todos" ||
      (videoDate.getMonth() + 1).toString() === selectedMonth;
    return matchesSearch && matchesYear && matchesMonth;
  });

  const years = Array.from(
    new Set(videos.map((video) => new Date(video.createdAt).getFullYear())),
  ).sort((a, b) => b - a);

  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-primary">Vídeos</h2>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Buscar vídeos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-200 bg-white pl-10 text-gray-900"
            />
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px] border-gray-200 bg-white text-gray-900">
              <SelectValue placeholder="Selecionar ano" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 bg-white">
              <SelectItem value="todos" className="text-gray-900">
                Todos os anos
              </SelectItem>
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="text-gray-900"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] border-gray-200 bg-white text-gray-900">
              <SelectValue placeholder="Selecionar mês" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 bg-white">
              <SelectItem value="todos" className="text-gray-900">
                Todos os meses
              </SelectItem>
              {months.map((month) => (
                <SelectItem
                  key={month.value}
                  value={month.value}
                  className="text-gray-900"
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
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
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-gray-900">
                      {selectedVideo.title}
                    </DialogTitle>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{selectedVideo.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(selectedVideo.createdAt)}</span>
                      </div>
                      {selectedVideo.dividendYield &&
                        selectedVideo.dividendYield !== "N/D" && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>DY: {selectedVideo.dividendYield}</span>
                          </div>
                        )}
                    </div>
                  </DialogHeader>
                  <div className="mt-4">
                    <p className="text-gray-600">
                      {selectedVideo.description || "Sem descrição disponível"}
                    </p>
                    {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedVideo.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
