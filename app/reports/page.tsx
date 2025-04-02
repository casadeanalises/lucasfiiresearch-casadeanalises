import NavbarWrapper from "../_components/navbar-wrapper";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import ReportsClient from "./reports-client";
import { ReportItem } from "../types/report";
import prisma, { queryWithRetry } from "@/app/lib/prisma";
import AdminBanner from "./_components/admin-banner";

interface DbReport {
  id: number;
  title: string;
  description: string | null;
  author: string;
  date: string;
  time: string;
  code: string;
  type: string;
  thumbnail: string;
  premium: boolean;
  tags: string | null;
  pageCount: number | null;
  month: string;
  year: string;
  url: string | null;
  fileContent: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  videoId: string | null;
  dividendYield: string | null;
  price: string | null;
}

const ReportsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const user = await clerkClient().users.getUser(userId);
  if (user.publicMetadata.subscriptionPlan !== "premium") {
    redirect("/subscription?message=subscription-required");
  }

  let reports: ReportItem[] = [];

  try {
    let pdfReports: DbReport[] = [];
    try {
      pdfReports = await queryWithRetry(async () => {
        return (await prisma.$queryRaw`
          SELECT * FROM "Report" 
          WHERE type = 'pdf' 
          ORDER BY "createdAt" DESC
        `) as DbReport[];
      });
    } catch (error) {
      console.error("Erro ao buscar PDFs:", error);
      pdfReports = [];
    }

    const formattedPdfReports: ReportItem[] = pdfReports.map(
      (pdf: DbReport) => ({
        id: pdf.id,
        title: pdf.title,
        description: pdf.description || "",
        author: pdf.author,
        date: pdf.date,
        time: pdf.time,
        code: pdf.code,
        type: pdf.type,
        thumbnail: pdf.thumbnail,
        premium: pdf.premium,
        tags: pdf.tags ? pdf.tags.split(",") : [],
        month: pdf.month,
        year: pdf.year,
        url: pdf.url || undefined,
        fileContent: pdf.fileContent || undefined,
        pageCount: pdf.pageCount || undefined,
      }),
    );

    reports = [...reports, ...formattedPdfReports];

    let videoReports: DbReport[] = [];
    try {
      videoReports = await queryWithRetry(async () => {
        return (await prisma.$queryRaw`
          SELECT * FROM "Report" 
          WHERE type = 'video' 
          ORDER BY "createdAt" DESC
        `) as DbReport[];
      });
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      videoReports = [];
    }

    const formattedVideoReports: ReportItem[] = videoReports.map(
      (video: DbReport) => {
        let videoDetails = {
          description: video.description || "",
          videoId: video.videoId || video.url || "",
          dividendYield: video.dividendYield || "",
          price: video.price || "",
        };

        try {
          if (video.description && video.description.trim().startsWith("{")) {
            const parsedDescription = JSON.parse(video.description);
            videoDetails = {
              description:
                parsedDescription.description || videoDetails.description,
              videoId: parsedDescription.videoId || videoDetails.videoId,
              dividendYield:
                parsedDescription.dividendYield || videoDetails.dividendYield,
              price: parsedDescription.price || videoDetails.price,
            };
          }
        } catch (error) {
          console.error("Erro ao parsear descrição do vídeo:", error);
        }

        return {
          id: video.id,
          title: video.title,
          description: videoDetails.description,
          author: video.author,
          date: video.date,
          time: video.time,
          code: video.code,
          type: "video",
          thumbnail: video.thumbnail,
          premium: video.premium,
          tags: video.tags ? video.tags.split(",") : [],
          month: video.month,
          year: video.year,
          videoId: videoDetails.videoId,
          dividendYield: videoDetails.dividendYield,
          price: videoDetails.price,
        };
      },
    );

    reports = [...reports, ...formattedVideoReports];
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
  }

  if (reports.length === 0) {
    reports = [];
  }

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

  // =========================================================================
  // SEÇÃO DE TRANSMISSÕES ANTERIORES (LIVES)
  // =========================================================================
  // Esta seção define os dados para as transmissões ao vivo anteriores.
  // Atualmente os dados estão definidos estaticamente, mas no futuro pode ser
  // modificado para buscar do banco de dados, assim como os vídeos e PDFs.
  //
  // COMO MODIFICAR NO FUTURO:
  // 1. Para buscar do banco de dados, crie uma tabela específica para lives ou
  //    use a mesma tabela de Report com um tipo específico (ex: type = 'live')
  // 2. Modifique este trecho para buscar dados do Prisma, similar aos vídeos:
  //    const liveReports = await queryWithRetry(async () => {
  //      return (await prisma.$queryRaw`
  //        SELECT * FROM "Report"
  //        WHERE type = 'live'
  //        ORDER BY "createdAt" DESC
  //      `) as DbReport[];
  //    });
  // 3. Faça o mapeamento dos dados conforme a estrutura abaixo
  //
  // ESTRUTURA DE CADA LIVE:
  // - id: identificador único da live
  // - title: título da transmissão
  // - description: descrição do conteúdo
  // - date: data da transmissão (formato DD/MM/YYYY)
  // - time: duração da transmissão (formato H:MM:SS)
  // - videoId: ID do YouTube para incorporar o vídeo
  // - isLive: indicador se é uma transmissão ao vivo (true) ou gravada (false)
  // - tags: array de tags relacionadas ao conteúdo
  // - author: objeto com informações do autor (name, role)
  // - stats: estatísticas como número de visualizações
  // - fiis: array de FIIs mencionados na live com código e dividend yield
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
    // Para adicionar mais lives, basta incluir mais objetos neste array
    // seguindo a mesma estrutura acima
  ];

  return (
    <>
      <NavbarWrapper />
      <ScrollArea>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h1 className="mb-2 text-4xl font-bold text-blue-900">
                Relatórios e Análises
              </h1>
              <p className="mx-auto max-w-2xl text-slate-600">
                Acesse os melhores relatórios e análises de FIIs para tomar
                decisões informadas em seus investimentos imobiliários.
              </p>
            </div>

            <AdminBanner />

            <ReportsClient
              reports={reports}
              videosByDate={videosByDate}
              pdfsByDate={pdfsByDate}
              lives={lives}
            />
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default ReportsPage;
