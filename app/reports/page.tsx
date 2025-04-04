import { Metadata } from "next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { VideoList } from "../components/reports/VideoList";
import { PDFList } from "../components/reports/PDFList";

export const metadata: Metadata = {
  title: "Reports - Casa de Análises",
  description: "Vídeos e PDFs de análises",
};

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-center text-4xl font-bold tracking-tight">
            Relatórios e Análises
          </h1>
          <p className="mx-auto max-w-2xl text-center text-muted-foreground">
            Acesse análises detalhadas, relatórios técnicos e vídeos
            explicativos sobre o mercado de FIIs. Todo o conteúdo é produzido
            por especialistas para ajudar você em suas decisões de investimento.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="videos" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="videos" className="py-3 text-base">
                Vídeos
              </TabsTrigger>
              <TabsTrigger value="pdfs" className="py-3 text-base">
                PDFs
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="videos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Vídeos em Destaque
                </h2>
                <p className="text-sm text-muted-foreground">
                  Análises em vídeo dos melhores FIIs do mercado
                </p>
              </div>
            </div>
            <VideoList />
          </TabsContent>

          <TabsContent value="pdfs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Relatórios em PDF
                </h2>
                <p className="text-sm text-muted-foreground">
                  Análises técnicas e relatórios detalhados
                </p>
              </div>
            </div>
            <PDFList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
