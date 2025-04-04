"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  FileText,
  Calendar,
  User,
  X,
  Download,
  Search,
  Eye,
} from "lucide-react";
import PdfViewer from "../ui/pdf-viewer";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PDF {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string;
  url: string | null;
  author: string;
  date: string;
  time: string;
  premium: boolean;
  tags: string[];
  createdAt: string;
  type: string;
  pageCount: number | null;
  fileContent?: string;
  category?: string;
}

export function PDFList() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("todos");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await fetch("/api/reports/pdfs");
        if (response.status === 403) {
          setError(
            "Você precisa ter um plano premium para acessar os PDFs. Assine agora!",
          );
          return;
        }
        if (!response.ok) {
          throw new Error("Erro ao carregar os PDFs");
        }
        const data = await response.json();
        console.log("PDFs recebidos:", data);
        setPdfs(data.filter((pdf: PDF) => pdf.type === "pdf"));
      } catch (err) {
        console.error("Erro ao buscar PDFs:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchPDFs();
  }, []);

  const filteredPDFs = pdfs.filter((pdf) => {
    const matchesSearch = pdf.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      selectedYear === "todos" ||
      new Date(pdf.date).getFullYear().toString() === selectedYear;
    const matchesCategory =
      selectedCategory === "todas" || pdf.category === selectedCategory;
    return matchesSearch && matchesYear && matchesCategory;
  });

  const years = Array.from(
    new Set(pdfs.map((pdf) => new Date(pdf.date).getFullYear())),
  ).sort((a, b) => b - a);

  const categories = Array.from(
    new Set(pdfs.map((pdf) => pdf.category).filter(Boolean)),
  ).sort();

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-red-500">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-primary">Documentos</h2>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-200 bg-white pl-10 text-gray-900"
            />
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px] border-gray-200 bg-white text-gray-900">
              <SelectValue placeholder="Selecionar ano" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 bg-white">
              <SelectItem value="todos" className="text-gray-900">
                Todos os anos
              </SelectItem>
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="text-gray-900"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] border-gray-200 bg-white text-gray-900">
              <SelectValue placeholder="Selecionar categoria" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 bg-white">
              <SelectItem value="todas" className="text-gray-900">
                Todas as categorias
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category || ""}
                  className="text-gray-900"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="grid grid-cols-[1fr,200px,150px,80px] gap-4 border-b border-gray-200 p-4 font-medium text-gray-700">
            <div>Título</div>
            <div>Categoria</div>
            <div>Data</div>
            <div className="text-center">Ações</div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredPDFs.map((pdf) => (
              <div
                key={pdf.id}
                className="grid grid-cols-[1fr,200px,150px,80px] gap-4 p-4 hover:bg-gray-50"
              >
                <div className="font-medium text-gray-900">{pdf.title}</div>
                <div className="text-gray-600">{pdf.category}</div>
                <div className="text-gray-600">{pdf.date}</div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setSelectedPDF(pdf)}
                    className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {pdf.url && (
                    <a
                      href={pdf.url}
                      download
                      className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedPDF} onOpenChange={() => setSelectedPDF(null)}>
        <DialogContent className="h-[90vh] max-w-6xl overflow-hidden bg-white p-0">
          {selectedPDF && (
            <>
              <button
                onClick={() => setSelectedPDF(null)}
                className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex h-full flex-col">
                <div className="border-b border-gray-200 bg-white p-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-gray-900">
                      {selectedPDF.title}
                    </DialogTitle>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{selectedPDF.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{selectedPDF.date}</span>
                      </div>
                    </div>
                  </DialogHeader>
                </div>
                <div className="flex-1 overflow-hidden bg-white p-6">
                  {selectedPDF.url ? (
                    <PdfViewer
                      url={selectedPDF.url}
                      title={selectedPDF.title}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                      <FileText className="mb-4 h-12 w-12 text-gray-400" />
                      <p className="mb-4 text-gray-600">
                        PDF não disponível para visualização
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
