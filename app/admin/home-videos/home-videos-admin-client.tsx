"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Switch } from "@/app/_components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { PlayCircle, Plus, Trash2, X, Loader2 } from "lucide-react";
import { Image } from "@/app/_components/ui/image";
import { Textarea } from "@/app/_components/ui/textarea";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

interface HomeVideo {
  _id: string;
  title: string;
  description: string;
  url: string;
  videoId: string;
  thumbnail: string;
  order: number;
  active: boolean;
}

export default function HomeVideosAdminClient() {
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<HomeVideo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar vídeos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/home-videos");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar vídeos");
      }

      setVideos(Array.isArray(data.videos) ? data.videos : []);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      setError("Erro ao carregar vídeos. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Adicionar vídeo
  const handleAddVideo = async () => {
    try {
      const response = await fetch("/api/home-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo),
      });

      if (!response.ok) throw new Error("Erro ao adicionar vídeo");

      await fetchVideos();
      setShowAddDialog(false);
      setNewVideo({ title: "", description: "", videoId: "" });
      toast.success("Vídeo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar vídeo:", error);
      toast.error("Erro ao adicionar vídeo");
    }
  };

  // Atualizar vídeo
  const handleUpdateVideo = async (id: string, data: Partial<HomeVideo>) => {
    try {
      const response = await fetch("/api/home-videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar vídeo");

      await fetchVideos();
      toast.success("Vídeo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar vídeo:", error);
      toast.error("Erro ao atualizar vídeo");
    }
  };

  // Remover vídeo
  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este vídeo?")) return;

    try {
      const response = await fetch(`/api/home-videos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover vídeo");

      await fetchVideos();
      toast.success("Vídeo removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover vídeo:", error);
      toast.error("Erro ao remover vídeo");
    }
  };

  const handleEdit = (video: HomeVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      videoId: video.videoId,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingVideo) {
        await handleUpdateVideo(editingVideo._id, formData);
      } else {
        // Enviar diretamente o formData
        const response = await fetch("/api/home-videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao adicionar vídeo");
        }

        toast.success("Vídeo adicionado com sucesso!");
        await fetchVideos();
      }

      setIsModalOpen(false);
      setEditingVideo(null);
      setFormData({ title: "", description: "", videoId: "" });
    } catch (error: any) {
      console.error("Erro ao salvar vídeo:", error);
      toast.error(error.message || "Erro ao salvar vídeo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciar Vídeos da Página Inicial
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Adicione e gerencie os vídeos que aparecem na página inicial
          </p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingVideo(null);
            setFormData({ title: "", description: "", videoId: "" });
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Adicionar Vídeo
        </button>
      </div>

      {/* Grid de Vídeos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video._id}
            className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md"
          >
            {/* Thumbnail com Overlay de Play */}
            <div className="relative aspect-video">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Informações do Vídeo */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{video.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {video.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  ID: {video.videoId}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Adicionar/Editar Vídeo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
            </DialogTitle>
            <DialogDescription>
              {editingVideo
                ? "Modifique as informações do vídeo abaixo"
                : "Preencha as informações do vídeo abaixo"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="videoId">ID do Vídeo do YouTube</Label>
                <Input
                  id="videoId"
                  value={formData.videoId}
                  onChange={(e) =>
                    setFormData({ ...formData, videoId: e.target.value })
                  }
                  placeholder="Ex: dQw4w9WgXcQ"
                />
              </div>

              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Digite o título do vídeo"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Digite uma breve descrição do vídeo"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
