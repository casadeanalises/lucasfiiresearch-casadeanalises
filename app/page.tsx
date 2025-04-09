"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "./_components/ui/button";
import {
  BarChart3Icon,
  TrendingUpIcon,
  LineChartIcon,
  PieChartIcon,
  UserIcon,
  PlayCircleIcon,
  BookOpenIcon,
  BellIcon,
  TrendingDownIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  X,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import AOS from "aos";
import { useEffect, useState } from "react";
import { useFIIData } from "./hooks/useFIIData";
import { Dialog, DialogContent } from "./_components/ui/dialog";
import Footer from "./_components/footer";

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

interface FIIQuote {
  ticker: string;
  price: string;
  change: string;
  isNegative: boolean;
}

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { quotes, loading } = useFIIData();
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<HomeVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const VIDEOS_TO_SHOW = 6; // Mostrar apenas 6 vídeos na homepage

  const carouselItems = [
    {
      image:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1470&auto=format&fit=crop",
      title: "Aprenda sobre FIIs",
      description: "Cursos e análises exclusivas para você",
    },
    {
      image:
        "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1473&auto=format&fit=crop",
      title: "Novos Relatórios",
      description: "Análises completas dos melhores FIIs",
    },
    {
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop",
      title: "Mercado Imobiliário",
      description: "Acompanhe as tendências do mercado",
    },
    {
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1471&auto=format&fit=crop",
      title: "Análise Técnica",
      description: "Aprenda a analisar gráficos e tendências",
    },
  ];

  // Dados de exemplo para os FIIs em destaque
  const featuredFIIs = [
    {
      ticker: "BTLG11",
      name: "BTG Pactual Logística",
      price: 97.15,
      changePercent: 1.49,
      yield: 10.0,
      category: "Logística",
    },
    {
      ticker: "HGLG11",
      name: "CSHG Logística",
      price: 155.8,
      changePercent: -0.75,
      yield: 8.8,
      category: "Logística",
    },
    {
      ticker: "VISC11",
      name: "Vinci Shopping Centers",
      price: 105.9,
      changePercent: 1.85,
      yield: 9.8,
      category: "Shoppings",
    },
    {
      ticker: "HFOF11",
      name: "Hedge Top FOFII",
      price: 87.5,
      changePercent: 0.95,
      yield: 10.2,
      category: "Fundos de Fundos",
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });

    // Auto-play do carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Buscar vídeos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("Iniciando busca de vídeos...");
        const response = await fetch("/api/home-videos");
        console.log("Status da resposta:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro na resposta:", errorData);
          throw new Error("Erro ao carregar vídeos");
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        if (!data.videos) {
          console.error("Resposta não contém array de vídeos:", data);
          throw new Error("Formato de resposta inválido");
        }

        // Filtrar apenas vídeos ativos e ordenar
        const activeVideos = data.videos
          .filter((v: HomeVideo) => v.active)
          .sort((a: HomeVideo, b: HomeVideo) => a.order - b.order);

        console.log("Vídeos filtrados:", activeVideos);
        setVideos(activeVideos);
      } catch (error) {
        console.error("Erro ao carregar vídeos:", error);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra de Cotação de Fundos */}
      <div className="w-full bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-2">
            <button className="rounded-full p-2 hover:bg-slate-100">
              <ChevronLeftIcon className="h-5 w-5 text-slate-600" />
            </button>

            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <span className="ml-2 text-sm text-slate-600">
                    Carregando cotações...
                  </span>
                </div>
              ) : (
                <div className="relative overflow-hidden">
                  <div className="animate-ticker flex whitespace-nowrap">
                    {/* Duplicate the array to create a seamless loop */}
                    {[...Array(2)].map((_, arrayIndex) => (
                      <div
                        key={arrayIndex}
                        className="flex items-center gap-6 px-4"
                      >
                        {quotes.map((fund: FIIQuote, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-md px-3 py-1.5 transition-all hover:bg-slate-100"
                          >
                            <div>
                              <p className="font-medium text-slate-800">
                                {fund.ticker}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">
                                  {fund.price}
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    fund.change === "0.00"
                                      ? "text-slate-600"
                                      : fund.isNegative
                                        ? "text-red-600"
                                        : "text-green-600"
                                  }`}
                                >
                                  {fund.change}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="rounded-full p-2 hover:bg-slate-100">
              <ChevronRightIcon className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Seção Principal */}
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Coluna da Esquerda */}
        <div className="col-span-6">
          <div className="flex h-full flex-col justify-center rounded-xl bg-[#00247D] p-6 text-white">
            <div className="flex items-center gap-8">
              <div className="h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/lucas_foto.png"
                  alt="Perfil"
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-3xl font-bold">VENHA APRENDER</h2>
                  <p className="text-xl text-slate-300">
                    A INVESTIR COM SABEDORIA!
                  </p>
                </div>
                <p className="text-xl">CASA DE RESEARCH 100% PRO-COTISTA!</p>
                <Link href="/subscription" className="w-full">
                  <Button className="w-full bg-blue-600 py-6 text-lg text-white hover:bg-blue-700">
                    ASSINE JÁ E SEJA MEMBRO
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Central - Carousel */}
        <div className="col-span-6">
          <div className="relative h-full overflow-hidden rounded-xl bg-[#00247D]">
            {/* Slides */}
            <div className="relative aspect-[21/9] w-full">
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h2 className="text-3xl font-bold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-lg text-slate-200">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Controles de navegação */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
            >
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
            >
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 w-8 rounded-full transition-all ${
                    index === currentSlide ? "bg-blue-400" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Seção de Youtube/Vídeos */}
        <div className="col-span-12">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircleIcon className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Youtube / Vídeos</h2>
              </div>

              {videos.length > 0 && (
                <div className="flex items-center gap-3">
                  <Link
                    href="/videos"
                    className="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <span>Ver mais vídeos</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href="https://www.youtube.com/@lucasfiis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                  >
                    <span>Ver no YouTube</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {loadingVideos ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <span className="ml-2 text-sm text-slate-600">
                  Carregando vídeos...
                </span>
              </div>
            ) : videos.length === 0 ? (
              <p className="text-center text-gray-500">
                Nenhum vídeo disponível
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
                {videos.slice(0, VIDEOS_TO_SHOW).map((video) => (
                  <div
                    key={video._id}
                    className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
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
                        <PlayCircleIcon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div className="p-2">
                      <h3 className="line-clamp-2 text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loadingVideos && videos.length > VIDEOS_TO_SHOW && (
              <div className="mt-6 flex justify-center">
                <span className="text-sm text-gray-500">
                  Mostrando {VIDEOS_TO_SHOW} de {videos.length} vídeos
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Fundos Imobiliários */}
        <div className="col-span-12">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3Icon className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">
                  Fundos Imobiliários em Destaque
                </h2>
              </div>

              <Link
                href="/fundlists"
                className="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                <span>Ver todos os fundos</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {featuredFIIs.map((fii) => (
                <Link
                  key={fii.ticker}
                  href={`/fundlists/${fii.ticker}`}
                  className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{fii.ticker}</span>
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                        {fii.category}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-blue-100">
                      {fii.name}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Preço</p>
                        <p className="text-lg font-semibold">
                          R$ {fii.price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Yield</p>
                        <p className="text-lg font-semibold text-green-600">
                          {fii.yield.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <span
                        className={`text-sm font-medium ${fii.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {fii.changePercent >= 0 ? (
                          <TrendingUpIcon className="mr-1 inline-block h-4 w-4" />
                        ) : (
                          <TrendingDownIcon className="mr-1 inline-block h-4 w-4" />
                        )}
                        {fii.changePercent.toFixed(2)}%
                      </span>
                      <span className="text-xs text-gray-500">hoje</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Seção de Notícias */}
        <div className="col-span-12">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Notícias
            </h2>
            <div className="grid grid-cols-4 gap-6">
              {[
                {
                  title: "Análise do Mercado Imobiliário",
                  description:
                    "Confira as últimas tendências do mercado de FIIs",
                  image:
                    "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1473&auto=format&fit=crop",
                },
                {
                  title: "Novos Fundos em Destaque",
                  description:
                    "Conheça os FIIs que estão se destacando este mês",
                  image:
                    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop",
                },
                {
                  title: "Estratégias de Investimento",
                  description:
                    "Aprenda as melhores estratégias para investir em FIIs",
                  image:
                    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1470&auto=format&fit=crop",
                },
                {
                  title: "Análise de Resultados",
                  description: "Resultados e dividendos dos principais FIIs",
                  image:
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop",
                },
              ].map((noticia, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={noticia.image}
                      alt={noticia.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800">
                      {noticia.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {noticia.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Vídeo */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="overflow-hidden bg-black p-0 sm:max-w-[900px]">
          <div className="relative">
            <Button
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
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default HomePage;
