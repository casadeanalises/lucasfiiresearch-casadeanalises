"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import ContentManager from "./_components/content-manager";

type ReportItem = {
  id: string;
  title: string;
  description: string | null;
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
  videoId: string | null;
  url: string | null;
  pageCount: number | null;
  dividendYield: string | null;
  price: string | null;
  createdAt: string;
};

interface ReportsAdminClientProps {
  adminEmail: string;
  initialSection?: "add" | "manage";
  initialTab?: "pdf" | "video";
}

const ReportsAdminClient = ({
  adminEmail,
  initialSection = "add",
  initialTab = "pdf",
}: ReportsAdminClientProps) => {
  const [activeTab, setActiveTab] = useState<"pdf" | "video">(initialTab);
  const [activeSection, setActiveSection] = useState<"add" | "manage">(
    initialSection,
  );

  const [isLoading, setIsLoading] = useState(false);
  // Item sendo editado (se houver)
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null);

  // Estado para PDFs
  const [reportData, setReportData] = useState<Partial<ReportItem>>({
    title: "",
    description: "",
    author: "Lucas Fii",
    date: new Date().toLocaleDateString("pt-BR"),
    time: new Date().toLocaleTimeString("pt-BR"),
    code: "N/D",
    type: "pdf",
    premium: false,
    tags: [],
    month: obterMesAtual(),
    year: new Date().getFullYear().toString(),
    pageCount: 1,
  });

  // Estado para vídeos
  const [videoData, setVideoData] = useState<Partial<ReportItem>>({
    title: "",
    description: "",
    author: "Lucas Fii",
    date: new Date().toLocaleDateString("pt-BR"),
    time: new Date().toLocaleTimeString("pt-BR"),
    code: "N/D",
    type: "video",
    premium: false,
    tags: [],
    month: obterMesAtual(),
    year: new Date().getFullYear().toString(),
    videoId: "",
    dividendYield: "N/D",
    price: "N/D",
  });

  const [tagInput, setTagInput] = useState("");
  const [videoTagInput, setVideoTagInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(
    null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoThumbnailInputRef = useRef<HTMLInputElement>(null);

  function obterMesAtual() {
    const meses = [
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
    return meses[new Date().getMonth()];
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setReportData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setReportData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !reportData.tags?.includes(tagInput.trim())) {
      setReportData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setReportData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);

    if (file) {
      // Criar preview para PDF (opcional)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Estimar número de páginas (aprox. 100kb por página)
      const estimatedPages = Math.max(1, Math.round(file.size / 102400));
      setReportData((prev) => ({ ...prev, pageCount: estimatedPages }));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verificar se temos uma URL
      if (!reportData.url) {
        toast.error("Por favor, informe a URL do PDF");
        setIsLoading(false);
        return;
      }

      // Preparar os dados do PDF
      const pdfReport = {
        title: reportData.title || "Sem título",
        description: reportData.description ?? "",
        author: reportData.author || "Lucas Fii",
        date: reportData.date || new Date().toLocaleDateString("pt-BR"),
        time: reportData.time || new Date().toLocaleTimeString("pt-BR"),
        code: reportData.code || "N/D",
        type: "pdf",
        thumbnail:
          reportData.thumbnail || "https://placehold.co/600x400/png?text=PDF",
        url: reportData.url ?? "",
        premium: reportData.premium || false,
        tags: Array.isArray(reportData.tags) ? reportData.tags : [],
        pageCount: reportData.pageCount ?? 1,
        month: reportData.month || obterMesAtual(),
        year: reportData.year || new Date().getFullYear().toString(),
        dividendYield: reportData.dividendYield ?? "",
        price: reportData.price ?? "",
      };

      // Enviar para a API
      const response = await fetch("/api/reports/pdfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfReport),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar PDF");
      }

      const result = await response.json();

      toast.success("PDF salvo com sucesso!");

      // Resetar o formulário
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar PDF:", error);
      toast.error("Erro ao salvar PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteUrl = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (text.startsWith("http") && text.toLowerCase().endsWith(".pdf")) {
          setReportData((prev) => ({ ...prev, url: text }));
          setPreviewUrl(text);
          toast.success("URL do PDF colada com sucesso!");
        } else {
          toast.error("O texto copiado não parece ser uma URL válida de PDF");
        }
      })
      .catch((err) => {
        console.error("Erro ao acessar a área de transferência:", err);
        toast.error("Erro ao acessar a área de transferência");
      });
  };

  // Manipuladores para vídeos
  const handleVideoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setVideoData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setVideoData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddVideoTag = () => {
    if (
      videoTagInput.trim() &&
      !videoData.tags?.includes(videoTagInput.trim())
    ) {
      setVideoData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), videoTagInput.trim()],
      }));
      setVideoTagInput("");
    }
  };

  const handleRemoveVideoTag = (tag: string) => {
    setVideoData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleVideoThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] || null;
    setVideoThumbnailFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setVideoThumbnailPreview(null);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar se temos o ID do vídeo
      if (!videoData.videoId) {
        toast.error("Por favor, informe o ID do vídeo do YouTube");
        setIsLoading(false);
        return;
      }

      // Extrair apenas o ID do vídeo se for uma URL completa
      let videoId = videoData.videoId;
      if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
        if (videoId.includes("youtube.com/watch?v=")) {
          const urlParams = new URLSearchParams(new URL(videoId).search);
          const idFromParams = urlParams.get("v");
          if (idFromParams) {
            videoId = idFromParams;
          }
        } else if (videoId.includes("youtu.be/")) {
          videoId = videoId.split("youtu.be/")[1]?.split("?")[0] || videoId;
        }
      }

      // Criar o objeto JSON da descrição que inclui os detalhes adicionais
      const descriptionObject = {
        description: videoData.description ?? "",
        videoId: videoId,
        dividendYield: videoData.dividendYield ?? "",
        price: videoData.price ?? "",
      };

      // Preparar os dados do vídeo
      const videoReport = {
        title: videoData.title || "Sem título",
        description: JSON.stringify(descriptionObject),
        author: videoData.author || "Lucas Fii",
        date: videoData.date || new Date().toLocaleDateString("pt-BR"),
        time: videoData.time || new Date().toLocaleTimeString("pt-BR"),
        code: videoData.code || "N/D",
        type: "video",
        thumbnail:
          videoData.thumbnail ||
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        premium: videoData.premium || false,
        tags: Array.isArray(videoData.tags) ? videoData.tags.join(",") : "",
        month: videoData.month || obterMesAtual(),
        year: videoData.year || new Date().getFullYear().toString(),
        videoId: videoId,
        dividendYield: videoData.dividendYield ?? "",
        price: videoData.price ?? "",
      };

      // Enviar para a API
      const response = await fetch("/api/reports/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoReport),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar vídeo");
      }

      const result = await response.json();

      toast.success("Vídeo salvo com sucesso!");

      // Resetar o formulário
      resetVideoForm();
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
      toast.error("Erro ao salvar vídeo");
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para logar quando a tab ou seção mudar
  useEffect(() => {
    if (activeSection === "add") {
      console.log(
        "Renderizando formulário",
        activeTab === "pdf" ? "PDF" : "Vídeo",
      );
    }
  }, [activeTab, activeSection]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (activeSection === "manage") {
      // Lógica de gerenciamento, se necessário
    }
  }, [activeSection, activeTab]);

  // Iniciar edição de um item
  const handleEdit = (item: ReportItem) => {
    setEditingItem(item);

    // Se for PDF, preencher o formulário de PDF
    if (item.type === "pdf") {
      setReportData({
        id: item.id,
        title: item.title,
        description: item.description,
        author: item.author,
        date: item.date,
        time: item.time,
        code: item.code,
        type: "pdf",
        premium: item.premium,
        tags: item.tags,
        month: item.month,
        year: item.year,
        pageCount: item.pageCount,
        url: item.url,
        thumbnail: item.thumbnail,
        dividendYield: item.dividendYield,
        price: item.price,
      });

      // Se tiver thumbnail, mostrar preview
      if (item.thumbnail) {
        setThumbnailPreview(item.thumbnail);
      }
    }
    // Se for vídeo, preencher o formulário de vídeo
    else {
      setVideoData({
        id: item.id,
        title: item.title,
        description: item.description,
        author: item.author,
        date: item.date,
        time: item.time,
        code: item.code,
        type: "video",
        premium: item.premium,
        tags: item.tags,
        videoId: item.videoId,
        month: item.month,
        year: item.year,
        dividendYield: item.dividendYield,
        price: item.price,
        thumbnail: item.thumbnail,
      });

      // Se tiver thumbnail, mostrar preview
      if (item.thumbnail) {
        setVideoThumbnailPreview(item.thumbnail);
      }
    }

    // Mudar para a aba de adição para mostrar o formulário preenchido
    setActiveSection("add");
  };

  // Atualizar o estado de PDF
  const updatePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Preparar dados para atualização
      const pdfData = {
        ...reportData,
        // Se não houve novo upload, manter a URL existente
        url: uploadedFile
          ? await simulateFileUpload(uploadedFile)
          : reportData.url,
        thumbnail: thumbnailFile
          ? await simulateFileUpload(thumbnailFile)
          : reportData.thumbnail,
      };

      // Enviar para a API
      const response = await fetch(`/api/reports/pdfs/${reportData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar PDF");
      }

      toast.success("PDF atualizado com sucesso!");
      resetForm();
      setActiveSection("manage");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar PDF");
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar o estado de vídeo
  const updateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Preparar dados para atualização
      const videoUpdateData = {
        ...videoData,
        // Se não houve novo upload, manter a URL existente
        thumbnail: videoThumbnailFile
          ? await simulateFileUpload(videoThumbnailFile)
          : videoData.thumbnail,
      };

      // Enviar para a API
      const response = await fetch(`/api/reports/videos/${videoData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoUpdateData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar vídeo");
      }

      toast.success("Vídeo atualizado com sucesso!");
      resetVideoForm();
      setActiveSection("manage");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar vídeo");
    } finally {
      setIsLoading(false);
    }
  };

  // Simular upload de arquivo (para demonstração)
  const simulateFileUpload = async (file: File): Promise<string> => {
    // Em produção, você faria upload para um serviço como S3, Firebase, etc.
    // Para demonstração, criamos uma URL temporária
    return URL.createObjectURL(file);
  };

  // Resetar formulário de PDF
  const resetForm = () => {
    setReportData({
      title: "",
      description: "",
      author: "Lucas Fii",
      date: new Date().toLocaleDateString("pt-BR"),
      time: new Date().toLocaleTimeString("pt-BR"),
      code: "N/D",
      type: "pdf",
      premium: false,
      tags: [],
      month: obterMesAtual(),
      year: new Date().getFullYear().toString(),
      pageCount: 1,
    });

    // Limpar arquivos
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    setUploadedFile(null);
    setThumbnailFile(null);
    setPreviewUrl(null);
    setThumbnailPreview(null);
    setEditingItem(null);
  };

  // Resetar formulário de vídeo
  const resetVideoForm = () => {
    setVideoData({
      title: "",
      description: "",
      author: "Lucas Fii",
      date: new Date().toLocaleDateString("pt-BR"),
      time: new Date().toLocaleTimeString("pt-BR"),
      code: "N/D",
      type: "video",
      premium: false,
      tags: [],
      month: obterMesAtual(),
      year: new Date().getFullYear().toString(),
      videoId: "",
      dividendYield: "N/D",
      price: "N/D",
    });

    // Limpar arquivos
    if (videoThumbnailInputRef.current)
      videoThumbnailInputRef.current.value = "";
    setVideoThumbnailFile(null);
    setVideoThumbnailPreview(null);
    setEditingItem(null);
  };

  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue-800">
          Área Administrativa
        </h2>
        <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.358-.035-.708-.104-1.047A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
          <span>Administrador: {adminEmail}</span>
        </div>
      </div>

      {/* Tabs para alternar entre PDFs e vídeos */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("pdf")}
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === "pdf"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {activeSection === "add" ? "Adicionar PDF" : "Gerenciar PDFs"}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === "video"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {activeSection === "add" ? "Adicionar Vídeo" : "Gerenciar Vídeos"}
            </div>
          </button>
        </nav>
      </div>

      {/* Segunda navegação para escolher entre adicionar ou gerenciar */}
      <div className="mb-8">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setActiveSection("add")}
            className={`relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-medium ${
              activeSection === "add"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            {isLoading && activeSection === "add" ? (
              <span className="inline-flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processando...
              </span>
            ) : (
              "Adicionar Novo"
            )}
          </button>
          <button
            onClick={() => setActiveSection("manage")}
            className={`relative -ml-px inline-flex items-center rounded-r-md px-4 py-2 text-sm font-medium ${
              activeSection === "manage"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
            Gerenciar Existentes
          </button>
        </div>
        {isLoading && (
          <div className="mt-2 text-sm text-blue-600">
            Carregando, por favor aguarde...
          </div>
        )}
      </div>

      {activeSection === "add" ? (
        // Código existente para adicionar conteúdo
        <>
          {activeTab === "pdf" ? (
            // Formulário para adicionar PDF
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-blue-800">
                  Adicionar Novo PDF
                </h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Título
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={reportData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Autor
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={reportData.author}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mês
                      </label>
                      <select
                        name="month"
                        value={reportData.month}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ano
                      </label>
                      <input
                        type="text"
                        name="year"
                        value={reportData.year}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Conteúdo Premium
                      </label>
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="premium"
                            checked={reportData.premium}
                            onChange={(e) =>
                              setReportData({
                                ...reportData,
                                premium: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Disponível apenas para assinantes premium
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      name="description"
                      value={reportData.description ?? ""}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      Arquivo PDF
                    </h4>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Upload de arquivo
                        </label>
                        <div className="mt-1 rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
                          <div className="flex flex-col items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="mt-2 text-center text-sm text-gray-500">
                              Upload desabilitado temporariamente
                            </p>
                            <p className="mt-1 text-center text-xs text-gray-400">
                              Em breve disponível
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          URL do PDF
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            name="url"
                            value={reportData.url || ""}
                            onChange={handleChange}
                            placeholder="https://exemplo.com/documento.pdf"
                            className="mt-1 block w-full rounded-l-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={handlePasteUrl}
                            className="mt-1 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Colar
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Por favor, informe a URL do PDF.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Salvando..." : "Salvar PDF"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            // Formulário para adicionar vídeo
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-blue-800">
                  Adicionar Novo Vídeo
                </h3>
                <form className="space-y-4" onSubmit={handleVideoSubmit}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Título
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={videoData.title}
                        onChange={handleVideoChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Autor
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={videoData.author}
                        onChange={handleVideoChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ID do Vídeo no YouTube
                      </label>
                      <input
                        type="text"
                        name="videoId"
                        value={videoData.videoId ?? ""}
                        onChange={handleVideoChange}
                        placeholder="Ex: dQw4w9WgXcQ"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mês
                      </label>
                      <select
                        name="month"
                        value={videoData.month}
                        onChange={handleVideoChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ano
                      </label>
                      <input
                        type="text"
                        name="year"
                        value={videoData.year}
                        onChange={handleVideoChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Conteúdo Premium
                      </label>
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="premium"
                            checked={videoData.premium}
                            onChange={(e) =>
                              setVideoData({
                                ...videoData,
                                premium: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Disponível apenas para assinantes premium
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      name="description"
                      value={videoData.description ?? ""}
                      onChange={handleVideoChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dividend Yield (opcional)
                      </label>
                      <input
                        type="text"
                        name="dividendYield"
                        value={videoData.dividendYield ?? ""}
                        onChange={handleVideoChange}
                        placeholder="Ex: 0,85%"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preço (opcional)
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={videoData.price ?? ""}
                        onChange={handleVideoChange}
                        placeholder="Ex: R$ 124,50"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Salvando..." : "Salvar Vídeo"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        // Componente de gerenciamento de conteúdo existente
        <ContentManager
          activeTab={activeTab}
          onEdit={(item: any) => {
            console.log("Editando item:", item);
            setEditingItem(item);

            if (item.type === "pdf") {
              console.log("Formulário PDF:", reportData);
            } else {
              console.log("Formulário vídeo:", videoData);
            }
            setActiveSection("add");
          }}
          onSetAddMode={() => setActiveSection("add")}
        />
      )}
    </div>
  );
};

export default ReportsAdminClient;
