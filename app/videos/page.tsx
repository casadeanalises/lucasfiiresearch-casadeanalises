"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlayCircleIcon,
  SearchIcon,
  CalendarIcon,
  ChevronLeftIcon,
  FilterIcon,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Dialog, DialogContent } from "@/app/_components/ui/dialog";
import { X } from "lucide-react";

interface HomeVideo {
  _id: string;
  videoId: string;
  title: string;
  description?: string;
  thumbnail: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<HomeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<HomeVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // Buscar vídeos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/videos");

        if (!response.ok) {
          throw new Error("Erro ao carregar vídeos");
        }

        const data = await response.json();

        if (!data.videos) {
          throw new Error("Formato de resposta inválido");
        }

        // Filtrar apenas vídeos ativos e ordenar
        const activeVideos = data.videos
          .filter((v: HomeVideo) => v.active)
          .sort((a: HomeVideo, b: HomeVideo) => a.order - b.order);

        setVideos(activeVideos);
        setFilteredVideos(activeVideos);

        // Extrair anos e meses dos vídeos
        const years = new Set<string>();
        const allMonths = new Set<string>();

        activeVideos.forEach((video: HomeVideo) => {
          if (video.createdAt) {
            const date = new Date(video.createdAt);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");

            years.add(year);
            allMonths.add(month);
          }
        });

        setAvailableYears(Array.from(years).sort((a, b) => b.localeCompare(a)));
        setAvailableMonths(Array.from(allMonths).sort());
      } catch (error) {
        console.error("Erro ao carregar vídeos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filtrar vídeos com base no termo de busca, ano e mês
  useEffect(() => {
    let result = [...videos];

    // Filtrar por termo de busca
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(term) ||
          (video.description && video.description.toLowerCase().includes(term)),
      );
    }

    // Filtrar por ano
    if (selectedYear) {
      result = result.filter((video) => {
        if (video.createdAt) {
          const date = new Date(video.createdAt);
          return date.getFullYear().toString() === selectedYear;
        }
        return false;
      });
    }

    // Filtrar por mês
    if (selectedMonth) {
      result = result.filter((video) => {
        if (video.createdAt) {
          const date = new Date(video.createdAt);
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          return month === selectedMonth;
        }
        return false;
      });
    }

    setFilteredVideos(result);
  }, [videos, searchTerm, selectedYear, selectedMonth]);

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedYear("");
    setSelectedMonth("");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Cabeçalho */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span>Voltar para a página inicial</span>
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                Biblioteca de Vídeos
              </h1>
              <p className="mt-1 text-gray-500">
                Assista a todos os nossos vídeos sobre investimentos e mercado
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Área de busca e filtros */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar vídeos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione o ano</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione o mês</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {months[parseInt(month) - 1]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(searchTerm || selectedYear || selectedMonth) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Filtros ativos:</span>
                {searchTerm && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
                    Busca: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 rounded-full hover:bg-blue-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedYear && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
                    Ano: {selectedYear}
                    <button
                      onClick={() => setSelectedYear("")}
                      className="ml-1 rounded-full hover:bg-blue-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedMonth && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
                    Mês: {months[parseInt(selectedMonth) - 1]}
                    <button
                      onClick={() => setSelectedMonth("")}
                      className="ml-1 rounded-full hover:bg-blue-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="rounded-md px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* Lista de vídeos */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <PlayCircleIcon className="h-6 w-6 text-blue-600" />
            {filteredVideos.length} vídeo
            {filteredVideos.length !== 1 ? "s" : ""} encontrado
            {filteredVideos.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-2 text-gray-600">Carregando vídeos...</span>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <PlayCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Nenhum vídeo encontrado
            </h3>
            <p className="mt-2 text-gray-500">
              Tente ajustar seus filtros ou realizar outra busca.
            </p>
            {(searchTerm || selectedYear || selectedMonth) && (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
            {filteredVideos.map((video) => (
              <div
                key={video._id}
                className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                onClick={() => {
                  setSelectedVideo(video);
                  setIsVideoModalOpen(true);
                }}
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <PlayCircleIcon className="h-12 w-12 text-white" />
                  </div>
                  {video.createdAt && (
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      {new Date(video.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-medium text-gray-900 group-hover:text-blue-600">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Vídeo */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="overflow-hidden bg-black p-0 sm:max-w-[900px]">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-50 h-8 w-8 rounded-full bg-black/50 p-0 text-white backdrop-blur-sm transition-all hover:bg-black/70"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative w-full pt-[56.25%]">
              {selectedVideo && (
                <iframe
                  className="absolute left-0 top-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            {selectedVideo && (
              <div className="bg-white p-4">
                <h2 className="mb-1 text-lg font-semibold">
                  {selectedVideo.title}
                </h2>
                {selectedVideo.description && (
                  <p className="text-sm text-slate-600">
                    {selectedVideo.description}
                  </p>
                )}
                {selectedVideo.createdAt && (
                  <p className="mt-2 text-sm text-gray-500">
                    Publicado em:{" "}
                    {new Date(selectedVideo.createdAt).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
