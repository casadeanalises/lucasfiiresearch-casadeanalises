"use client";

import React, { useState } from "react";
import VideoCard from "../_components/ui/video-card";
import PDFCard from "../_components/ui/pdf-card";
import LiveCard from "../_components/ui/live-card";
import PDFViewer from "../_components/ui/pdf-viewer";
import { ReportItem } from "../types/report";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../_components/ui/tabs";
import ReportCard from "./_components/report-card";

interface ReportsClientProps {
  reports: ReportItem[];
  videosByDate: Record<string, Record<string, ReportItem[]>>;
  pdfsByDate: Record<string, Record<string, ReportItem[]>>;
  lives: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
  };
}

const ReportsClient = ({
  reports,
  videosByDate,
  pdfsByDate,
  lives,
  pagination,
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
    <div>
      <Tabs defaultValue="pdfs" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3">
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="lives">Lives</TabsTrigger>
        </TabsList>

        <TabsContent value="pdfs">
          {Object.keys(pdfsByDate)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((year) => (
              <div key={year} className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  {year}
                </h2>
                {Object.keys(pdfsByDate[year])
                  .sort((a, b) => {
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
                    return months.indexOf(b) - months.indexOf(a);
                  })
                  .map((month) => (
                    <div key={`${year}-${month}`} className="mb-6">
                      <h3 className="mb-4 text-xl font-semibold text-gray-700">
                        {month}
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pdfsByDate[year][month].map((report) => (
                          <ReportCard key={report.id} report={report} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </TabsContent>

        <TabsContent value="videos">
          {Object.keys(videosByDate)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((year) => (
              <div key={year} className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  {year}
                </h2>
                {Object.keys(videosByDate[year])
                  .sort((a, b) => {
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
                    return months.indexOf(b) - months.indexOf(a);
                  })
                  .map((month) => (
                    <div key={`${year}-${month}`} className="mb-6">
                      <h3 className="mb-4 text-xl font-semibold text-gray-700">
                        {month}
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {videosByDate[year][month].map((report) => (
                          <ReportCard key={report.id} report={report} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </TabsContent>

        <TabsContent value="lives">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lives.map((live) => (
              <LiveCard key={live.id} live={live} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <a
                key={pageNumber}
                href={`${pagination.baseUrl}?page=${pageNumber}`}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                  pageNumber === pagination.currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-blue-50"
                }`}
              >
                {pageNumber}
              </a>
            ),
          )}
        </div>
      )}

      {/* Filtros */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("month", e.target.value);
            window.location.href = url.toString();
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2"
        >
          <option value="">Todos os meses</option>
          {[
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
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("year", e.target.value);
            window.location.href = url.toString();
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2"
        >
          <option value="">Todos os anos</option>
          {Array.from(
            { length: new Date().getFullYear() - 2023 + 1 },
            (_, i) => 2023 + i,
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("type", e.target.value);
            window.location.href = url.toString();
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2"
        >
          <option value="">Todos os tipos</option>
          <option value="pdf">PDFs</option>
          <option value="video">Vídeos</option>
        </select>
      </div>
    </div>
  );
};

export default ReportsClient;
