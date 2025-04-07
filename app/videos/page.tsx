"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Calendar,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  Play,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "../utils/formatters";

// Interface para os vídeos
interface HomeVideo {
  id: number;
  url: string;
  title: string;
  thumbnail: string;
  description: string;
  date: string;
  active: boolean;
  order: number;
}

// Componente para a página de vídeos
export default function VideosPage() {
  const router = useRouter();

  // Estados
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<HomeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<HomeVideo | null>(null);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Mapeamento de nomes de meses
  const monthNames = [
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

  // Buscar vídeos da API
  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Em um ambiente real, faríamos uma requisição à API
      const response = await fetch("/api/videos");

      // Como estamos usando dados mockados, vamos criar alguns vídeos
      const mockVideos = Array.from({ length: 24 }, (_, i) => {
        // Distribuir os vídeos ao longo dos últimos 3 anos
        const year = 2023 - Math.floor(i / 8);
        const month = i % 12;
        const day = Math.floor(Math.random() * 28) + 1;

        const date = new Date(year, month, day);

        return {
          id: i + 1,
          url: `https://www.youtube.com/watch?v=example${i}`,
          title: `Análise de FIIs - ${monthNames[month]} de ${year}`,
          thumbnail: `https://picsum.photos/id/${i * 10 + 100}/640/360`,
          description: `Análise dos principais fundos imobiliários do mês de ${monthNames[month]} de ${year}`,
          date: date.toISOString(),
          active: true,
          order: i,
        };
      });

      // Ordenar por data (mais recente primeiro)
      mockVideos.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      setVideos(mockVideos);
      setFilteredVideos(mockVideos);

      // Extrair anos e meses disponíveis dos vídeos
      const years = [
        ...new Set(
          mockVideos.map((video) =>
            new Date(video.date).getFullYear().toString(),
          ),
        ),
      ];
      setAvailableYears(years);

      const months = [
        ...new Set(
          mockVideos.map((video) => {
            const date = new Date(video.date);
            return `${date.getMonth()}`;
          }),
        ),
      ];

      setAvailableMonths(months);
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar vídeos quando o componente é montado
  useEffect(() => {
    fetchVideos();
  }, []);

  // Filtrar vídeos quando o termo de busca ou seleções de filtro mudam
  useEffect(() => {
    if (videos.length === 0) return;

    let filtered = [...videos];

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(term) ||
          video.description.toLowerCase().includes(term),
      );
    }

    // Filtrar por ano
    if (selectedYear) {
      filtered = filtered.filter((video) => {
        const videoYear = new Date(video.date).getFullYear().toString();
        return videoYear === selectedYear;
      });
    }

    // Filtrar por mês
    if (selectedMonth !== null) {
      filtered = filtered.filter((video) => {
        const videoMonth = new Date(video.date).getMonth().toString();
        return videoMonth === selectedMonth;
      });
    }

    setFilteredVideos(filtered);
  }, [searchTerm, selectedYear, selectedMonth, videos]);

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  // Dados para os gráficos de estatísticas
  const statsData = useMemo(() => {
    if (videos.length === 0) return { byYear: [], byMonth: [] };

    // Contagem de vídeos por ano
    const yearCounts: Record<string, number> = {};
    videos.forEach((video) => {
      const year = new Date(video.date).getFullYear().toString();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    const byYear = Object.entries(yearCounts)
      .map(([year, count]) => ({
        year,
        count,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));

    // Contagem de vídeos por mês
    const monthCounts: Record<string, number> = {};
    videos.forEach((video) => {
      const month = new Date(video.date).getMonth();
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    const byMonth = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      count: monthCounts[i] || 0,
    }));

    return { byYear, byMonth };
  }, [videos, monthNames]);

  // Função para formatar data
  const formatVideoDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Verificar se há filtros ativos
  const hasActiveFilters =
    selectedYear !== null || selectedMonth !== null || searchTerm !== "";

  // Cores para o gráfico de pizza
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Vídeos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore nossas análises e conteúdos em vídeo
          </p>
        </div>
        <Link
          href="/"
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 md:mt-0"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para o início
        </Link>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="mb-8 rounded-lg bg-white p-4 shadow dark:bg-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Campo de busca */}
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-10 text-gray-900 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-100"
              placeholder="Buscar vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </button>
            )}
          </div>

          {/* Filtro de ano */}
          <div className="relative">
            <button
              className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-100 md:w-auto"
              onClick={() => setShowYearDropdown(!showYearDropdown)}
            >
              <Calendar className="mr-2 h-5 w-5 text-gray-400" />
              <span>{selectedYear || "Selecionar Ano"}</span>
              {showYearDropdown ? (
                <ChevronUp className="ml-2 h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
              )}
            </button>

            {showYearDropdown && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-slate-700">
                <div className="max-h-60 overflow-auto">
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-slate-600"
                    onClick={() => {
                      setSelectedYear(null);
                      setShowYearDropdown(false);
                    }}
                  >
                    Todos
                  </button>
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      className={`block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-600 ${
                        selectedYear === year
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedYear(year);
                        setShowYearDropdown(false);
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtro de mês */}
          <div className="relative">
            <button
              className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-100 md:w-auto"
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            >
              <Filter className="mr-2 h-5 w-5 text-gray-400" />
              <span>
                {selectedMonth !== null
                  ? monthNames[parseInt(selectedMonth)]
                  : "Selecionar Mês"}
              </span>
              {showMonthDropdown ? (
                <ChevronUp className="ml-2 h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
              )}
            </button>

            {showMonthDropdown && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-slate-700">
                <div className="max-h-60 overflow-auto">
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-slate-600"
                    onClick={() => {
                      setSelectedMonth(null);
                      setShowMonthDropdown(false);
                    }}
                  >
                    Todos
                  </button>
                  {Array.from({ length: 12 }, (_, i) => i.toString()).map(
                    (month) => (
                      <button
                        key={month}
                        className={`block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-600 ${
                          selectedMonth === month
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                        onClick={() => {
                          setSelectedMonth(month);
                          setShowMonthDropdown(false);
                        }}
                      >
                        {monthNames[parseInt(month)]}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botão de estatísticas */}
          <button
            className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600"
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart className="mr-2 h-5 w-5 text-gray-400" />
            <span>
              {showStats ? "Ocultar Estatísticas" : "Ver Estatísticas"}
            </span>
          </button>

          {/* Botão de limpar filtros */}
          {hasActiveFilters && (
            <button
              className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-red-600 hover:bg-red-50 dark:border-gray-600 dark:bg-slate-700 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={clearFilters}
            >
              <X className="mr-2 h-5 w-5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        {/* Status dos filtros ativos */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Filtros ativos:
            </span>

            {searchTerm && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Busca: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedYear && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Ano: {selectedYear}
                <button
                  onClick={() => setSelectedYear(null)}
                  className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedMonth !== null && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Mês: {monthNames[parseInt(selectedMonth)]}
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Seção de estatísticas */}
      {showStats && (
        <div className="mb-8 rounded-lg bg-white p-4 shadow dark:bg-slate-800">
          <h2 className="mb-4 text-xl font-bold">Estatísticas de Vídeos</h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Gráfico de vídeos por ano */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Vídeos por Ano</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statsData.byYear}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e080" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                      formatter={(value) => [`${value} vídeos`, "Quantidade"]}
                      labelFormatter={(label) => `Ano: ${label}`}
                    />
                    <Bar dataKey="count" fill="#3b82f6" name="Vídeos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de vídeos por mês */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Vídeos por Mês</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData.byMonth.filter((item) => item.count > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="month"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statsData.byMonth
                        .filter((item) => item.count > 0)
                        .map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} vídeos`, "Quantidade"]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de vídeos */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="transform overflow-hidden rounded-lg bg-white shadow transition hover:scale-[1.02] hover:shadow-lg dark:bg-slate-800"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-48 w-full object-cover"
                />
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition hover:bg-opacity-50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white">
                    <Play className="h-6 w-6" />
                  </div>
                </button>
              </div>

              <div className="p-4">
                <h3 className="mb-1 line-clamp-2 text-lg font-semibold">
                  {video.title}
                </h3>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {formatVideoDate(video.date)}
                </p>
                <p className="mb-3 line-clamp-2 text-gray-600 dark:text-gray-300">
                  {video.description}
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Assistir
                    <Play className="ml-1 h-4 w-4" />
                  </button>

                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    YouTube
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-yellow-50 p-6 text-center dark:bg-yellow-900/20">
          <h3 className="mb-2 text-lg font-medium text-yellow-800 dark:text-yellow-200">
            Nenhum vídeo encontrado
          </h3>
          <p className="text-yellow-600 dark:text-yellow-300">
            Não foram encontrados vídeos com os filtros selecionados.
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 text-blue-600 hover:underline dark:text-blue-400"
              >
                Limpar filtros
              </button>
            )}
          </p>
        </div>
      )}

      {/* Modal de vídeo */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white shadow-lg dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={selectedVideo.url.replace("watch?v=", "embed/")}
                title={selectedVideo.title}
                className="h-full w-full"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">
                  {formatVideoDate(selectedVideo.date)}
                </p>
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Ver no YouTube
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
