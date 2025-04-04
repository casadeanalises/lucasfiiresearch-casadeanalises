import { Metadata } from "next";
import { VideoList } from "../components/reports/VideoList";
import { PDFList } from "../components/reports/PDFList";
import { TrendingUp, FileText, PlayCircle, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Reports - Casa de Análises",
  description: "Vídeos e PDFs de análises",
};

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 via-blue-100/50 to-blue-50">
        <div className="bg-grid-white/10 absolute inset-0" />
        <div className="container relative mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Análises & Relatórios
            </h1>
            <p className="max-w-2xl text-center text-xl text-gray-600">
              Acesse análises detalhadas, relatórios técnicos e vídeos
              explicativos sobre o mercado de FIIs.
            </p>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <PlayCircle className="h-5 w-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Vídeos em Destaque
                </h2>
              </div>
              <p className="text-gray-600">
                Análises aprofundadas dos melhores FIIs do mercado
              </p>
            </div>
            <button className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
            <VideoList />
          </div>
        </div>
      </section>

      {/* PDFs Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Relatórios Técnicos
                </h2>
              </div>
              <p className="text-gray-600">
                Análises técnicas e relatórios detalhados em PDF
              </p>
            </div>
            <button className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
            <PDFList />
          </div>
        </div>
      </section>
    </div>
  );
}
