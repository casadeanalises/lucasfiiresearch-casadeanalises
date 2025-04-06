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
} from "lucide-react";
import AOS from "aos";
import { useEffect, useState } from "react";

const LoggedInHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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

            <div className="flex flex-1 items-center gap-8 overflow-hidden px-4">
              {[
                {
                  ticker: "FCFL11",
                  price: "R$ 111,50",
                  change: "-0.45",
                  isNegative: true,
                },
                {
                  ticker: "CPTS11",
                  price: "R$ 7,24",
                  change: "+0.42",
                  isNegative: false,
                },
                {
                  ticker: "SCPF11",
                  price: "R$ 1,84",
                  change: "0.00",
                  isNegative: false,
                },
                {
                  ticker: "KNOX11",
                  price: "R$ 100,90",
                  change: "0.00",
                  isNegative: false,
                },
                {
                  ticker: "BARI11",
                  price: "R$ 74,57",
                  change: "+1.46",
                  isNegative: false,
                },
                {
                  ticker: "AGXY3",
                  price: "R$ 0,53",
                  change: "+1.92",
                  isNegative: false,
                },
                {
                  ticker: "CYRE3",
                  price: "R$ 24,10",
                  change: "+1.56",
                  isNegative: false,
                },
                {
                  ticker: "BNFS11",
                  price: "R$ 70,10",
                  change: "0.00",
                  isNegative: false,
                },
              ].map((fund, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div>
                    <p className="font-medium text-slate-800">{fund.ticker}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">
                        {fund.price}
                      </span>
                      <span
                        className={`text-sm ${
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
      </div>

      {/* Seção de Youtube/Vídeos */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
          <PlayCircleIcon className="h-5 w-5 text-red-600" />
          Youtube / Vídeos
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            {
              title: "#XPML11 #ALZR11 #TRXF11 BATE PAPO!",
              thumbnail: "https://img.youtube.com/vi/cxO_bmcRSGs/mqdefault.jpg",
            },
            {
              title: "FICA11 - PRESSÃO SURTE EFEITO!",
              thumbnail: "https://img.youtube.com/vi/7jE7yJpNRk0/mqdefault.jpg",
            },
            {
              title: "#HSML11 - NOSSO APETITE AUMENTOU!",
              thumbnail: "https://img.youtube.com/vi/haoc0d4YArk/mqdefault.jpg",
            },
            {
              title: "#MCCI11 - ÓTIMAS NOTÍCIAS ESSA SEMANA!",
              thumbnail: "https://img.youtube.com/vi/09BBpgWvgTA/mqdefault.jpg",
            },
          ].map((video, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:opacity-0">
                  <div className="rounded-full bg-white/90 p-2">
                    <PlayCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Notícias */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
          <LineChartIcon className="h-5 w-5 text-primary" />
          Notícias
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            {
              title: "Análise do Mercado Imobiliário",
              description: "Confira as últimas tendências do mercado de FIIs",
              image:
                "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1473&auto=format&fit=crop",
            },
            {
              title: "Novos Fundos em Destaque",
              description: "Conheça os FIIs que estão se destacando este mês",
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

      {/* Hero Section com Dashboard Preview */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Informações do Usuário e Métricas */}
            <div className="space-y-6" data-aos="fade-right">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">
                  Bem-vindo de volta!
                </h1>
                <p className="text-slate-400">
                  Aqui está o resumo da sua carteira e as últimas atualizações
                </p>
              </div>

              {/* Cards de Métricas */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-500/20 p-2">
                      <TrendingUpIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">
                        Rendimento Mensal
                      </p>
                      <p className="text-xl font-bold text-white">
                        R$ 1.250,00
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-500/20 p-2">
                      <PieChartIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Investido</p>
                      <p className="text-xl font-bold text-white">
                        R$ 25.000,00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alertas e Notificações */}
              <div className="space-y-3 rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-white">Alertas Recentes</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <p className="text-sm text-slate-300">
                      KNIP11 - Distribuição de rendimentos anunciada
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <p className="text-sm text-slate-300">
                      HGLG11 - Queda significativa detectada
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview do Dashboard */}
            <div className="relative" data-aos="fade-left">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-indigo-500 opacity-30 blur-xl"></div>
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                <Image
                  src="/dashboard-preview.png"
                  alt="Dashboard Preview"
                  width={800}
                  height={500}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Conteúdo Principal */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Coluna de Análises */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <LineChartIcon className="h-5 w-5 text-primary" />
                Análises Recentes
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: "XPLG11 - Análise Completa",
                    type: "Logística",
                    status: "Alta",
                  },
                  {
                    title: "HGLG11 - Relatório Mensal",
                    type: "Logística",
                    status: "Neutra",
                  },
                  {
                    title: "KNIP11 - Atualização",
                    type: "Papel",
                    status: "Baixa",
                  },
                ].map((analise, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer space-y-2 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">
                        {analise.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          analise.status === "Alta"
                            ? "bg-green-100 text-green-800"
                            : analise.status === "Baixa"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {analise.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{analise.type}</p>
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <span>Ver análise</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna de Cursos */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <BookOpenIcon className="h-5 w-5 text-primary" />
                Seus Cursos
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: "Análise Fundamentalista",
                    progress: 75,
                    lessons: 12,
                  },
                  {
                    title: "Gestão de Risco",
                    progress: 45,
                    lessons: 8,
                  },
                  {
                    title: "Valuation de FIIs",
                    progress: 20,
                    lessons: 15,
                  },
                ].map((curso, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer space-y-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <h3 className="font-semibold text-slate-800">
                      {curso.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{curso.lessons} aulas</span>
                      <span>{curso.progress}% concluído</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-primary transition-all group-hover:brightness-110"
                        style={{ width: `${curso.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <span>Continuar curso</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoggedInHome;
