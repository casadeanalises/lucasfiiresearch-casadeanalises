import Image from "next/image";
import Link from "next/link";
import { Button } from "../_components/ui/button";
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
} from "lucide-react";
import AOS from "aos";
import { useEffect, useState } from "react";
import { useFIIData } from "../hooks/useFIIData";
import { Dialog, DialogContent } from "../_components/ui/dialog";

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

const LoggedInHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { quotes, loading } = useFIIData();
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<HomeVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
        const response = await fetch("/api/videos");
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
                        {quotes.map((fund, index) => (
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <span className="inline-flex items-center rounded-full bg-blue-600/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <PlayCircleIcon className="mr-1 h-3 w-3" />
                            Assistir agora
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { LoggedInHome };
