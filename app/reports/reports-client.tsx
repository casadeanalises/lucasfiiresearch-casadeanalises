"use client";

import React, { useState } from "react";
import VideoCard from "../_components/ui/video-card";
import PDFCard from "../_components/ui/pdf-card";
import LiveCard from "../_components/ui/live-card";
import PDFViewer from "../_components/ui/pdf-viewer";
import { ReportItem } from "../types/report";

interface ReportsClientProps {
  reports: ReportItem[];
  videosByDate: Record<string, Record<string, ReportItem[]>>;
  pdfsByDate: Record<string, Record<string, ReportItem[]>>;
  lives: any[];
}

const ReportsClient = ({
  reports,
  videosByDate,
  pdfsByDate,
  lives,
}: ReportsClientProps) => {
  const [activeVideoYear, setActiveVideoYear] = useState<string>("all");
  const [activeVideoMonth, setActiveVideoMonth] = useState<string>("all");
  const [activePdfYear, setActivePdfYear] = useState<string>("all");
  const [activePdfMonth, setActivePdfMonth] = useState<string>("all");

  // Filtros de conteúdo (se necessário implementar depois)
  const [contentFilter, setContentFilter] = useState<"all" | "video" | "pdf">(
    "all",
  );

  return (
    <>
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

        {reports.filter((report) => report.type === "video").length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reports
              .filter(
                (report) => report.type === "video" && "videoId" in report,
              )
              .slice(0, 4)
              .map((report) => (
                <VideoCard key={report.id} report={report} />
              ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">Nenhum vídeo disponível no momento.</p>
          </div>
        )}

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
                  onChange={(e) => setActiveVideoYear(e.target.value)}
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
                  onChange={(e) => setActiveVideoMonth(e.target.value)}
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
            </div>
          </div>

          {/* Lista de vídeos filtrados */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.keys(videosByDate)
              .sort((a, b) => Number(b) - Number(a))
              .filter(
                (year) => activeVideoYear === "all" || year === activeVideoYear,
              )
              .map((year) =>
                Object.keys(videosByDate[year])
                  .filter(
                    (month) =>
                      activeVideoMonth === "all" || month === activeVideoMonth,
                  )
                  .map((month) =>
                    videosByDate[year][month].map((video) => (
                      <VideoCard key={video.id} report={video} />
                    )),
                  ),
              )}
          </div>
        </div>
      </div>

      {/* =========================================================================
       * SEÇÃO DE TRANSMISSÕES ANTERIORES
       * =========================================================================
       * Esta seção renderiza a lista de transmissões ao vivo anteriores.
       *
       * COMO MODIFICAR ESTA SEÇÃO:
       * 1. A estrutura atual é simples: um título seguido de um grid de cards
       * 2. Os dados vêm do array 'lives' que é passado como prop do componente pai (app/reports/page.tsx)
       * 3. Cada live é renderizada usando o componente LiveCard
       * 4. Para expandir funcionalidades, você pode:
       *    - Adicionar filtros por data/tema similar aos vídeos e PDFs
       *    - Implementar paginação se a lista crescer muito
       *    - Adicionar categorização por temas
       *    - Incluir um botão "Ver todas" similar às outras seções
       *    - Adicionar um destaque para a live mais recente
       * 5. Certifique-se de modificar também a definição de dados em app/reports/page.tsx
       *
       * NOTA: Esta seção está temporariamente desativada.
       */}
      {/* 
      <h3 className="mb-4 mt-8 text-xl font-semibold text-blue-900">
        Transmissões Anteriores
      </h3>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lives.map((live) => (
          <LiveCard key={live.id} live={live} />
        ))}
      </div>
      */}

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
            Acesse análises técnicas detalhadas e relatórios fundamentalistas
            para fundamentar suas decisões de investimento.
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

        {reports.filter((report) => report.type === "pdf").length > 0 ? (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {reports
              .filter((report) => report.type === "pdf" && "url" in report)
              .slice(0, 4)
              .map((report) => (
                <PDFCard key={report.id} report={report} />
              ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">Nenhum PDF disponível no momento.</p>
          </div>
        )}

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
              Acesse nossa coleção completa de relatórios, análises e documentos
              técnicos
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
                    onChange={(e) => setActivePdfYear(e.target.value)}
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
                    onChange={(e) => setActivePdfMonth(e.target.value)}
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
              </div>
            </div>
          </div>

          {/* === Visualização em grid para PDFs ===   */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.keys(pdfsByDate)
              .sort((a, b) => Number(b) - Number(a))
              .filter(
                (year) => activePdfYear === "all" || year === activePdfYear,
              )
              .map((year) =>
                Object.keys(pdfsByDate[year])
                  .filter(
                    (month) =>
                      activePdfMonth === "all" || month === activePdfMonth,
                  )
                  .map((month) =>
                    pdfsByDate[year][month]
                      .filter((pdf) => pdf.type === "pdf")
                      .map((pdf) => <PDFCard key={pdf.id} report={pdf} />),
                  ),
              )}
          </div>
        </div>
      </div>

      {/* Opcional: Seção de PDF Viewer para um relatório destacado */}
      {reports.filter((r) => r.type === "pdf").length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 border-l-4 border-blue-600 pl-3 text-2xl font-semibold text-blue-900">
            Relatório em Destaque
          </h2>
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-[500px] w-full border-r border-gray-100">
                {reports.find((r) => r.type === "pdf" && r.url)?.url && (
                  <PDFViewer
                    fileUrl={
                      reports.find((r) => r.type === "pdf" && r.url)?.url || ""
                    }
                  />
                )}
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {reports
                      .find((r) => r.type === "pdf")
                      ?.tags.slice(0, 3)
                      .map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">
                      {reports.find((r) => r.type === "pdf")?.date}
                    </span>
                  </div>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-blue-900">
                  {reports.find((r) => r.type === "pdf")?.title ||
                    "Relatório Destacado"}
                </h3>
                <p className="mb-6 text-gray-700">
                  {reports.find((r) => r.type === "pdf")?.description ||
                    "Descrição do relatório destacado."}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-800">
                      {reports
                        .find((r) => r.type === "pdf")
                        ?.author.charAt(0) || "A"}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {reports.find((r) => r.type === "pdf")?.author ||
                          "Autor"}
                      </p>
                      <p className="text-sm text-gray-500">Analista de FIIs</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {reports.find((r) => r.type === "pdf" && r.url)?.url && (
                      <>
                        <a
                          href={
                            reports.find((r) => r.type === "pdf" && r.url)?.url
                          }
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
                          href={
                            reports.find((r) => r.type === "pdf" && r.url)?.url
                          }
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportsClient;
