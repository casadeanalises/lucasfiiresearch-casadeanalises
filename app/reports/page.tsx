// import { db } from "../_lib/prisma";
// import { DataTable } from "../_components/ui/data-table";
// import { transactionColumns } from "./_columns";
import Navbar from "../_components/navbar";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import PDFViewer from "../_components/ui/pdf-viewer";
import VideoCard from "../_components/ui/video-card";
import PDFCard from "../_components/ui/pdf-card";
import LiveCard from "../_components/ui/live-card";

// Define interfaces for our data types
interface ReportItem {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  thumbnail: string;
  premium: boolean;
  tags: string[];
  month: string;
  year: string;
  videoId?: string;
  url?: string;
  pageCount?: number;
  dividendYield?: string;
  price?: string;
  relatedVideoId?: string | null;
}

const ReportsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Check if user has premium subscription
  const user = await clerkClient().users.getUser(userId);
  if (user.publicMetadata.subscriptionPlan !== "premium") {
    redirect("/subscription?message=subscription-required");
  }

  // const transactions = await db.transaction.findMany({
  //   where: {
  //     userId,
  //   },
  //   orderBy: {
  //     date: "desc",
  //   },
  // });

  // == Videos de relatórios ==

  const reports = [
    {
      id: 1,
      title: "#RINV11 - AGIO GIGANTESCO!",
      description:
        "Seja bem vindo a mais um video no canal Lucas FII. Não deixe de se inscrever no canal!! ",
      author: "Lucas FII",
      date: "31/03/2025",
      time: "11:01:12",
      code: "HGBL11",
      type: "video",
      thumbnail: "/reports/hgbl11.jpg",
      videoId: "SThgvVve_XI",
      premium: false,
      tags: ["Shopping", "Dividend Yield", "Alto Potencial"],
      dividendYield: "0.85%",
      price: "R$ 124,50",
      month: "Março",
      year: "2025",
    },
    {
      id: 2,
      title: "ANÁLISE DO RELATÓRIO GERENCIAL DO HREC11",
      description: "Conheça as informações divulgadas pelo FII.",
      author: "LANA SANTOS",
      date: "05/03/2025",
      time: "16:54:13",
      code: "HREC11",
      type: "video",
      thumbnail: "/reports/hrec11.jpg",
      videoId: "sN93RPqoJF0",
      premium: false,
      tags: ["Recebíveis", "Aluguel", "Distribuição Mensal"],
      dividendYield: "1.15%",
      price: "R$ 86,22",
      month: "Março",
      year: "2025",
    },
    {
      id: 3,
      title: "PANORAMA DO MERCADO DE LAJES CORPORATIVAS",
      description: "Conheça o desempenho no 4° Trimestre de 2024",
      author: "LANA SANTOS",
      date: "25/02/2025",
      time: "10:14:54",
      code: "N/D",
      type: "video",
      thumbnail: "/reports/panorama.jpg",
      videoId: "OvLRUoNMCYE",
      premium: true,
      tags: ["Lajes", "Corporativo", "Análise Setorial"],
      dividendYield: "N/D",
      price: "N/D",
      month: "Fevereiro",
      year: "2025",
    },
    {
      id: 4,
      title: "MUDANÇA NA CLASSIFICAÇÃO DOS FIIS",
      description: "Saiba mais sobre as novas mudanças da Anbima",
      author: "LANA SANTOS",
      date: "05/02/2025",
      time: "11:56:44",
      code: "N/D",
      type: "video",
      thumbnail: "/reports/classificacao.jpg",
      videoId: "KvP-U0hxVEA",
      premium: true,
      tags: ["Regulação", "Anbima", "Atualização"],
      dividendYield: "N/D",
      price: "N/D",
      month: "Fevereiro",
      year: "2025",
    },
    {
      id: 5,
      title: "ANÁLISE FUNDAMENTALISTA DE FIIS - 1º TRIMESTRE 2025",
      description:
        "Relatório completo com análise dos principais FIIs do mercado",
      author: "LANA SANTOS",
      date: "10/03/2025",
      time: "09:30:00",
      code: "VÁRIOS",
      type: "pdf",
      thumbnail: "/reports/analise-fundamentalista.jpg",
      url: "/reports/analise-fundamentalista.pdf",
      premium: true,
      tags: ["Análise Fundamentalista", "Trimestral", "Comparativo"],
      pageCount: 42,
      month: "Março",
      year: "2025",
      relatedVideoId: null,
    },
    {
      id: 6,
      title: "GUIA DE INVESTIMENTOS EM FIIS PARA INICIANTES",
      description:
        "Aprenda os conceitos básicos e estratégias para investir em FIIs",
      author: "LANA SANTOS",
      date: "01/01/2025",
      time: "08:15:22",
      code: "N/D",
      type: "pdf",
      thumbnail: "/reports/guia-iniciantes.jpg",
      url: "/reports/guia-iniciantes.pdf",
      premium: false,
      tags: ["Educacional", "Iniciantes", "Estratégias"],
      pageCount: 28,
      month: "Janeiro",
      year: "2025",
      relatedVideoId: null,
    },
    {
      id: 7,
      title: "Relatório Detalhado: HGBL11 - Agio e Perspectivas",
      description: "Análise aprofundada com métricas e projeções",
      author: "Lucas FII",
      date: "31/03/2025",
      time: "11:30:00",
      code: "HGBL11",
      type: "pdf",
      thumbnail: "/reports/hgbl11-pdf.jpg",
      url: "/reports/hgbl11-analise.pdf",
      premium: true,
      tags: ["Shopping", "Dividend Yield", "Alto Potencial", "Análise Técnica"],
      pageCount: 18,
      month: "Março",
      year: "2025",
      relatedVideoId: "SThgvVve_XI",
    },
    {
      id: 8,
      title: "KNRI11 - ANÁLISE DE RESULTADOS",
      description: "Resultados do último trimestre e projeções",
      author: "Lucas FII",
      date: "15/01/2025",
      time: "14:22:45",
      code: "KNRI11",
      type: "video",
      thumbnail: "/reports/knri11.jpg",
      videoId: "abc123xyz",
      premium: false,
      tags: ["Lajes Corporativas", "Resultados", "Análise"],
      dividendYield: "0.72%",
      price: "R$ 142,80",
      month: "Janeiro",
      year: "2025",
    },
    {
      id: 9,
      title: "XPLG11 - YIELD ACIMA DE 1%",
      description: "Análise completa do XPLG11 e seus resultados",
      author: "Lucas FII",
      date: "10/01/2025",
      time: "09:45:18",
      code: "XPLG11",
      type: "video",
      thumbnail: "/reports/xplg11.jpg",
      videoId: "def456uvw",
      premium: false,
      tags: ["Logística", "Yield", "Análise"],
      dividendYield: "1.05%",
      price: "R$ 95,30",
      month: "Janeiro",
      year: "2025",
    },
  ];

  // Organize videos by year and month
  const organizeByDate = (items: Array<ReportItem>) => {
    const organized: Record<string, Record<string, ReportItem[]>> = {};

    items.forEach((item) => {
      if (!organized[item.year]) {
        organized[item.year] = {};
      }

      if (!organized[item.year][item.month]) {
        organized[item.year][item.month] = [];
      }

      organized[item.year][item.month].push(item);
    });

    return organized;
  };

  const videosByDate = organizeByDate(
    reports.filter((report) => report.type === "video"),
  );

  const pdfsByDate = organizeByDate(
    reports.filter((report) => report.type === "pdf"),
  );

  // Simulando dados de lives
  const lives = [
    {
      id: 1,
      title: "LIVE COPOM",
      description:
        "Nesta transmissão ao vivo, falamos sobre o COPOM e como isso impacta os FIIs.",
      date: "19/03/2025",
      time: "1:22:50",
      videoId: "qwiXqE2QXYg",
      isLive: true,
      tags: ["", "", ""],
      author: {
        name: "Lucas FII",
        role: "Especialista FIIs",
      },
      stats: {
        viewers: 0,
      },
      fiis: [
        { code: "XPML11", dividendYield: "0,78%" },
        { code: "VISC11", dividendYield: "0,82%" },
        { code: "HGBS11", dividendYield: "0,76%" },
        { code: "HSML11", dividendYield: "0,72%" },
      ],
    },

    {
      id: 2,
      title: "LIVE DATA COM MARÇO/25",
      description: "",
      date: "28/05/2023",
      time: "14:00",
      videoId: "Z-GMpl7vMpg",
      isLive: false,
      tags: ["Resultados", "Trimestral", "Lajes Corporativas"],
      author: {
        name: "Lucas FII",
        role: "Especialista FIIs",
      },
      fiis: [
        { code: "HGLG11", dividendYield: "0,92%" },
        { code: "KNRI11", dividendYield: "0,85%" },
      ],
    },

    {
      id: 3,
      title: "Live: Novos FIIs Lançados em 2023 - Vale a pena investir?",
      description:
        "Análise dos novos fundos imobiliários que entraram no mercado este ano e suas perspectivas.",
      date: "15/05/2023",
      time: "20:00",
      videoId: "j4OCQoYZPWU",
      isLive: false,
      tags: ["IPO", "Novos FIIs", "Estratégia"],
      author: {
        name: "LANA SANTOS",
        role: "Especialista FIIs",
      },
    },
    {
      id: 4,
      title: "Impacto da Taxa Selic nos FIIs - Análise ao vivo",
      description:
        "Discussão sobre como as mudanças na taxa de juros afetam diferentes segmentos de fundos imobiliários.",
      date: "02/05/2023",
      time: "18:30",
      videoId: "cVCLnZE-sJM",
      isLive: false,
      tags: ["Selic", "Juros", "Impacto"],
      author: {
        name: "LANA SANTOS",
        role: "Especialista FIIs",
      },
    },
  ];

  return (
    <>
      <Navbar />
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

            {/*== Filtros ==*/}

            {/* TODO: <div className="mb-8 flex flex-wrap justify-center gap-2">
              <button className="rounded-full bg-blue-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                Todos
              </button>
              <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50">
                Vídeos
              </button>
              <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50">
                PDFs
              </button>
              <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50">
                Shopping
              </button>
              <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50">
                Lajes
              </button>
              <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50">
                Recebíveis
              </button>
            </div> */}

            {/*== Seção de Vídeos ==*/}

            <div className="mb-12">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="border-l-4 border-blue-600 pl-3 text-2xl font-semibold text-blue-900">
                  Análises em Vídeo
                </h2>
                <a
                  href="#video-history"
                  className="flex items-center rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-800 transition-all hover:bg-blue-200"
                >
                  Ver todos
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {reports
                  .filter(
                    (report) => report.type === "video" && "videoId" in report,
                  )
                  .slice(0, 4)
                  .map((report) => (
                    <VideoCard
                      key={report.id}
                      report={
                        report as Parameters<typeof VideoCard>[0]["report"]
                      }
                    />
                  ))}
              </div>

              {/* === Timeline de Vídeos === */}

              <div
                id="video-history"
                className="mt-10 rounded-lg bg-white p-6 shadow-md"
              >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-blue-800">
                    Histórico de Vídeos
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <select
                        className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        defaultValue="all"
                      >
                        <option value="all">Todos os anos</option>
                        {Object.keys(videosByDate)
                          .sort((a, b) => Number(b) - Number(a))
                          .map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        defaultValue="all"
                      >
                        <option value="all">Todos os meses</option>
                        <option value="Janeiro">Janeiro</option>
                        <option value="Fevereiro">Fevereiro</option>
                        <option value="Março">Março</option>
                        <option value="Abril">Abril</option>
                        <option value="Maio">Maio</option>
                        <option value="Junho">Junho</option>
                        <option value="Julho">Julho</option>
                        <option value="Agosto">Agosto</option>
                        <option value="Setembro">Setembro</option>
                        <option value="Outubro">Outubro</option>
                        <option value="Novembro">Novembro</option>
                        <option value="Dezembro">Dezembro</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <button
                      disabled
                      className="cursor-not-allowed rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-50 transition-all hover:bg-blue-700"
                    >
                      Filtrar
                    </button>
                    <button
                      disabled
                      className="cursor-not-allowed rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 opacity-50 transition-all hover:bg-gray-50"
                    >
                      Limpar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mb-4 mt-8 text-xl font-semibold text-blue-900">
              Transmissões Anteriores
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lives.slice(1).map((live) => (
                <LiveCard key={live.id} live={live} />
              ))}
            </div>

            {/* == Seção de PDFs == */}

            <div className="mb-12 mt-24">
              <div className="relative mb-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gradient-to-br from-slate-50 to-slate-100 px-4 text-sm text-gray-500">
                    DOCUMENTAÇÃO E ANÁLISES
                  </span>
                </div>
              </div>

              <div className="mb-8 text-center">
                <h2 className="mb-3 text-3xl font-bold text-blue-900">
                  Relatórios em PDF
                </h2>
                <p className="mx-auto max-w-2xl text-slate-600">
                  Acesse análises técnicas detalhadas e relatórios
                  fundamentalistas para fundamentar suas decisões de
                  investimento.
                </p>
              </div>

              <div className="mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 p-6 shadow-sm">
                <div className="flex-1">
                  <h3 className="mb-1 text-xl font-semibold text-indigo-900">
                    Biblioteca completa de documentos
                  </h3>
                  <p className="text-sm text-indigo-700">
                    Análises detalhadas, guias e relatórios técnicos de fundos
                    imobiliários
                  </p>
                </div>
                <a
                  href="#pdf-history"
                  className="flex items-center rounded-full bg-indigo-600 px-5 py-2 font-medium text-white transition-all hover:bg-indigo-700"
                >
                  Ver todos os relatórios
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>

              <div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {reports
                  .filter(
                    (report) =>
                      report.type === "pdf" &&
                      "url" in report &&
                      "pageCount" in report,
                  )
                  .slice(0, 4)
                  .map((report) => (
                    <PDFCard
                      key={report.id}
                      report={report as Parameters<typeof PDFCard>[0]["report"]}
                    />
                  ))}
              </div>

              {/* === Timeline de PDFs === */}

              <div
                id="pdf-history"
                className="mt-16 rounded-xl bg-white p-8 shadow-lg"
              >
                <div className="mb-8 border-b border-gray-100 pb-6">
                  <h3 className="mb-2 text-2xl font-semibold text-indigo-900">
                    Biblioteca de Documentos
                  </h3>
                  <p className="text-gray-600">
                    Acesse nossa coleção completa de relatórios, análises e
                    documentos técnicos
                  </p>
                </div>

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="max-w-xl">
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      Filtrar por:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <select
                          className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          defaultValue="all"
                        >
                          <option value="all">Todos os anos</option>
                          {Object.keys(pdfsByDate)
                            .sort((a, b) => Number(b) - Number(a))
                            .map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="relative">
                        <select
                          className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          defaultValue="all"
                        >
                          <option value="all">Todos os meses</option>
                          <option value="Janeiro">Janeiro</option>
                          <option value="Fevereiro">Fevereiro</option>
                          <option value="Março">Março</option>
                          <option value="Abril">Abril</option>
                          <option value="Maio">Maio</option>
                          <option value="Junho">Junho</option>
                          <option value="Julho">Julho</option>
                          <option value="Agosto">Agosto</option>
                          <option value="Setembro">Setembro</option>
                          <option value="Outubro">Outubro</option>
                          <option value="Novembro">Novembro</option>
                          <option value="Dezembro">Dezembro</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="relative">
                        <select
                          className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          defaultValue="all"
                        >
                          <option value="all">Todos os tipos</option>
                          <option value="Análise">Análise</option>
                          <option value="Relatório">Relatório</option>
                          <option value="Guia">Guia</option>
                          <option value="Educacional">Educacional</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar nos documentos..."
                      className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* === Visualização em grid para PDFs ===   */}

                <div className="mb-10">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reports
                      .filter((report) => report.type === "pdf")
                      .map((pdf) => (
                        <div
                          key={pdf.id}
                          className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-indigo-700"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <span className="text-xs font-medium text-gray-500">
                                {pdf.date}
                              </span>
                            </div>
                            {pdf.premium && (
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                                Premium
                              </span>
                            )}
                          </div>

                          <h4 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900">
                            {pdf.title}
                          </h4>

                          <p className="mb-3 line-clamp-2 text-xs text-gray-600">
                            {pdf.description}
                          </p>

                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {pdf.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{pdf.pageCount} páginas</span>
                            </div>

                            <div className="flex space-x-2">
                              {pdf.relatedVideoId && (
                                <a
                                  href={`https://www.youtube.com/watch?v=${pdf.relatedVideoId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-800 transition-colors hover:bg-red-200"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                  </svg>
                                </a>
                              )}

                              <a
                                href={pdf.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </a>

                              <a
                                href={pdf.url}
                                download
                                className="rounded-lg bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 transition-colors hover:bg-indigo-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </a>
                            </div>
                          </div>

                          <div className="absolute inset-0 hidden bg-gradient-to-t from-indigo-50/80 to-transparent group-hover:block"></div>
                          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full transform p-4 transition-transform duration-300 group-hover:block group-hover:translate-y-0">
                            <a
                              href={pdf.url}
                              download
                              className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Download PDF
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Navegação de páginas */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Mostrando <span className="font-medium">9</span> relatórios
                  </span>

                  <div className="flex space-x-1">
                    <button
                      disabled
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 opacity-50"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16l-4-4m0 0l4-4m-4 4h18"
                        />
                      </svg>
                      Anterior
                    </button>
                    <button
                      disabled
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 opacity-50"
                    >
                      Próximo
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção Modal para Visualização */}

            <div className="mb-12">
              <h2 className="mb-6 border-l-4 border-blue-600 pl-3 text-2xl font-semibold text-blue-900">
                Em Destaque: Análise HGBL11
              </h2>
              <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                  <div className="p-6 lg:col-span-2">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
                      <div className="relative aspect-video w-full">
                        <img
                          src={`https://img.youtube.com/vi/${reports[0].videoId}/maxresdefault.jpg`}
                          alt={reports[0].title}
                          className="h-full w-full rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-900/20 to-indigo-900/20"></div>
                        <a
                          href={`https://www.youtube.com/watch?v=${reports[0].videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 transition-colors hover:bg-red-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                className="h-6 w-6"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>

                    {/* Documento Relacionado - Visível apenas se houver um PDF relacionado */}
                    {reports.find(
                      (pdf) =>
                        pdf.type === "pdf" &&
                        pdf.relatedVideoId === reports[0].videoId,
                    ) && (
                      <div className="mt-4 rounded-lg border border-dashed border-green-300 bg-green-50 p-4">
                        <div className="flex items-start">
                          <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-green-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="mb-1 text-sm font-medium text-green-800">
                              Documento relacionado disponível
                            </h4>
                            <p className="mb-2 text-xs text-green-700">
                              Este vídeo possui um documento PDF com análise
                              detalhada
                            </p>
                            <a
                              href={
                                reports.find(
                                  (pdf) =>
                                    pdf.type === "pdf" &&
                                    pdf.relatedVideoId === reports[0].videoId,
                                )?.url
                              }
                              download
                              className="flex items-center text-xs font-medium text-green-700 hover:text-green-900"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-1 h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Baixar PDF
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 pt-0 lg:col-span-3 lg:pt-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {reports[0].tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-blue-900">
                      {reports[0].title}
                    </h3>
                    <p className="mb-4 text-gray-700">
                      {reports[0].description} Nesta análise, detalhamos os
                      principais pontos do relatório gerencial e como eles podem
                      impactar o desempenho futuro do fundo.
                    </p>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="mb-1 text-sm text-gray-500">
                          Dividend Yield Mensal
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {reports[0].dividendYield}
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="mb-1 text-sm text-gray-500">
                          Preço Atual
                        </p>
                        <p className="text-xl font-bold text-blue-900">
                          {reports[0].price}
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="mb-1 text-sm text-gray-500">
                          Taxa de Ocupação
                        </p>
                        <p className="text-xl font-bold text-blue-900">98.7%</p>
                      </div>
                    </div>

                    <div className="mb-4 rounded-lg bg-gray-50 p-4">
                      <h4 className="mb-2 text-sm font-semibold text-gray-700">
                        Publicado em:
                      </h4>
                      <div className="flex items-center text-sm">
                        <div className="flex items-center text-blue-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              clipRule="evenodd"
                            />
                          </svg>
                          {reports[0].date}
                        </div>
                        <span className="mx-2 text-gray-500">•</span>
                        <div className="flex items-center text-blue-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {reports[0].time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
                          {reports[0].author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{reports[0].author}</p>
                          <p className="text-sm text-gray-500">
                            Analista de FIIs
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-end gap-2">
                          <a
                            href={`https://www.youtube.com/watch?v=${reports[0].videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
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
                          <button className="flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-800">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-1 h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                            Compartilhar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de PDF Viewer */}
            <div className="mb-12">
              <h2 className="mb-6 border-l-4 border-blue-600 pl-3 text-2xl font-semibold text-blue-900">
                Relatório em Destaque
              </h2>
              <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="h-[500px] w-full border-r border-gray-100">
                    <PDFViewer fileUrl="/reports/analise-fundamentalista.pdf" />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                          Análise Fundamentalista
                        </span>
                        <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                          Trimestral
                        </span>
                        <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                          Comparativo
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">
                          {reports.find((r) => r.id === 5)?.date}
                        </span>
                      </div>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-blue-900">
                      ANÁLISE FUNDAMENTALISTA DE FIIS - 1º TRIMESTRE 2025
                    </h3>
                    <p className="mb-6 text-gray-700">
                      Relatório completo com análise dos principais FIIs do
                      mercado. Este documento oferece uma visão aprofundada
                      sobre o desempenho e perspectivas dos fundos imobiliários
                      mais relevantes.
                    </p>

                    <div className="mb-6">
                      <h4 className="mb-3 text-lg font-semibold text-blue-800">
                        Sumário do Relatório
                      </h4>
                      <ul className="list-inside list-disc space-y-2 text-gray-700">
                        <li>Panorama do mercado de FIIs no trimestre</li>
                        <li>Análise setorial: shopping, lajes, recebíveis</li>
                        <li>Top 10 FIIs com melhor desempenho</li>
                        <li>Perspectivas para o próximo trimestre</li>
                        <li>Recomendações de investimento</li>
                      </ul>
                    </div>

                    <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-bold">Importante:</span> Este
                        relatório é exclusivo para assinantes Premium. Acesse
                        conteúdo completo para obter todas as análises e
                        recomendações.
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-800">
                          L
                        </div>
                        <div>
                          <p className="font-semibold">LANA SANTOS</p>
                          <p className="text-sm text-gray-500">
                            Analista de FIIs
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href="/reports/analise-fundamentalista.pdf"
                          target="_blank"
                          className="flex items-center rounded-lg bg-indigo-100 px-4 py-2 text-indigo-800 transition-colors hover:bg-indigo-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Visualizar
                        </a>
                        <a
                          href="/reports/analise-fundamentalista.pdf"
                          download
                          className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* === Seção de Histórico de Relatórios === */}

            <div className="mb-12">
              <h2 className="mb-6 border-l-4 border-blue-600 pl-3 text-2xl font-semibold text-blue-900">
                Histórico de Relatórios
              </h2>
              <div className="rounded-lg bg-white p-6 shadow-lg">
                {/* Filtros */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-blue-700">
                      Todos os Conteúdos
                    </button>
                    <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50">
                      Vídeos
                    </button>
                    <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50">
                      PDFs
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Pesquisar relatórios..."
                      className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Data
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Título
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Tipo
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          FII
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Categoria
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {reports
                        .sort((a, b) => {
                          // Ordenar por data (mais recente primeiro)
                          const dateA = a.date.split("/").reverse().join("");
                          const dateB = b.date.split("/").reverse().join("");
                          return dateB.localeCompare(dateA);
                        })
                        .map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              <div className="flex flex-col">
                                <span>{report.date}</span>
                                <span className="text-xs text-gray-400">
                                  {report.time}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-blue-100">
                                  {report.type === "video" ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-blue-700"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-blue-700"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 100-2H7z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {report.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    por {report.author}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                                  report.type === "video"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {report.type === "video" ? "Vídeo" : "PDF"}
                              </span>
                              {report.premium && (
                                <span className="ml-2 inline-flex rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold leading-5 text-indigo-800">
                                  Premium
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                              {report.code !== "N/D" ? (
                                <span className="rounded bg-blue-800/80 px-2 py-1 text-xs font-bold text-white">
                                  {report.code}
                                </span>
                              ) : (
                                <span className="text-gray-500">N/D</span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {report.tags.slice(0, 2).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {report.tags.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{report.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                {report.type === "video" ? (
                                  <a
                                    href={`https://www.youtube.com/watch?v=${report.videoId}`}
                                    target="_blank"
                                    className="flex items-center text-red-600 hover:text-red-900"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="mr-1 h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path
                                        fillRule="evenodd"
                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Assistir
                                  </a>
                                ) : (
                                  <a
                                    href={report.url}
                                    download
                                    className="flex items-center text-blue-600 hover:text-blue-900"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="mr-1 h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Download
                                  </a>
                                )}

                                {/* Indica relação entre PDF e vídeo */}
                                {report.type === "pdf" &&
                                  report.relatedVideoId && (
                                    <a
                                      href={`https://www.youtube.com/watch?v=${report.relatedVideoId}`}
                                      target="_blank"
                                      className="flex items-center text-red-600 hover:text-red-900"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-1 h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                      </svg>
                                    </a>
                                  )}

                                {report.type === "video" &&
                                  reports.find(
                                    (pdf) =>
                                      pdf.type === "pdf" &&
                                      pdf.relatedVideoId === report.videoId,
                                  ) && (
                                    <a
                                      href={
                                        reports.find(
                                          (pdf) =>
                                            pdf.type === "pdf" &&
                                            pdf.relatedVideoId ===
                                              report.videoId,
                                        )?.url
                                      }
                                      download
                                      className="flex items-center text-blue-600 hover:text-blue-900"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-1 h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </a>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">1</span> a{" "}
                    <span className="font-medium">{reports.length}</span> de{" "}
                    <span className="font-medium">{reports.length}</span>{" "}
                    resultados
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      disabled
                    >
                      Anterior
                    </button>
                    <button
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      disabled
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TODO: Seção de Transações/relatorios Recentes */}
          {/* <div>
            <h2 className="mb-6 border-l-4 border-blue-600 pl-3 text-2xl font-semibold text-blue-900">
              Suas Transações Recentes
            </h2>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <DataTable
                columns={transactionColumns}
                data={JSON.parse(JSON.stringify(transactions))}
              />
            </div>
          </div> */}
        </div>
      </ScrollArea>
    </>
  );
};

export default ReportsPage;
