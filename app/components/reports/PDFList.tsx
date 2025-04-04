"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FileText, Calendar, User, X, Download, Eye } from "lucide-react";

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
}

export function PDFList() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);

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

  if (!pdfs.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        Nenhum PDF encontrado.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pdfs.map((pdf) => (
          <Card
            key={pdf.id}
            className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
            onClick={() => setSelectedPDF(pdf)}
          >
            <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-20 w-20 text-primary/40" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-full bg-white/90 p-3">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
              {pdf.premium && (
                <span className="absolute right-2 top-2 rounded-full bg-yellow-500 px-3 py-1 text-sm font-medium text-white shadow-lg">
                  Premium
                </span>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-lg">
                {pdf.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {pdf.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="truncate">{pdf.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{pdf.date}</span>
                </div>
              </div>
              {pdf.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {pdf.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedPDF} onOpenChange={() => setSelectedPDF(null)}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          {selectedPDF && (
            <>
              <button
                onClick={() => setSelectedPDF(null)}
                className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="bg-gradient-to-b from-background to-background/80 p-6 backdrop-blur-sm">
                <DialogHeader className="mb-6">
                  <DialogTitle className="mb-2 text-2xl">
                    {selectedPDF.title}
                  </DialogTitle>
                  <p className="text-muted-foreground">
                    {selectedPDF.description}
                  </p>
                </DialogHeader>
                <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">Autor:</span>
                    <span className="text-muted-foreground">
                      {selectedPDF.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Data:</span>
                    <span className="text-muted-foreground">
                      {selectedPDF.date}
                    </span>
                  </div>
                </div>
                {selectedPDF.tags.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {selectedPDF.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="rounded-lg border bg-card">
                  {selectedPDF.fileContent ? (
                    <iframe
                      src={`data:application/pdf;base64,${selectedPDF.fileContent}`}
                      className="h-[600px] w-full rounded-lg"
                    />
                  ) : (
                    <div className="flex h-[200px] flex-col items-center justify-center p-6 text-center">
                      <FileText className="mb-4 h-12 w-12 text-primary/40" />
                      <p className="mb-4 text-muted-foreground">
                        Conteúdo do PDF não disponível para visualização
                      </p>
                      <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                        <Download className="h-4 w-4" />
                        Baixar PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
