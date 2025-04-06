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
import { PlayCircle, Plus, Trash2, X } from "lucide-react";

interface HomeVideo {
  _id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  order: number;
  active: boolean;
}

interface HomeVideosAdminClientProps {
  adminEmail: string;
}

export default function HomeVideosAdminClient({
  adminEmail,
}: HomeVideosAdminClientProps) {
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVideo, setNewVideo] = useState({
    videoId: "",
    title: "",
  });

  // Carregar vídeos
  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/home-videos");
      if (!response.ok) throw new Error("Erro ao carregar vídeos");
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      toast.error("Erro ao carregar vídeos");
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
      setNewVideo({ videoId: "", title: "" });
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

  return (
    <div>
      {/* Header com informações do admin */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Área Administrativa</CardTitle>
          <CardDescription>Administrador: {adminEmail}</CardDescription>
        </CardHeader>
      </Card>

      {/* Botão de adicionar vídeo */}
      <div className="mb-6">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Vídeo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">
                Adicionar Novo Vídeo
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Adicione um novo vídeo à página inicial. Cole o ID ou URL do
                vídeo do YouTube.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="videoId" className="text-gray-700">
                  ID ou URL do Vídeo
                </Label>
                <Input
                  id="videoId"
                  value={newVideo.videoId}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, videoId: e.target.value })
                  }
                  placeholder="Ex: dQw4w9WgXcQ ou https://youtube.com/watch?v=dQw4w9WgXcQ"
                  className="border-gray-300 bg-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-gray-700">
                  Título
                </Label>
                <Input
                  id="title"
                  value={newVideo.title}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, title: e.target.value })
                  }
                  placeholder="Título do vídeo"
                  className="border-gray-300 bg-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="bg-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddVideo}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de vídeos */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-2">Carregando vídeos...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video._id}>
              <CardHeader className="relative">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-4 top-4 z-10"
                  onClick={() => handleDeleteVideo(video._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <PlayCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-500">ID: {video.videoId}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={video.active}
                      onCheckedChange={(checked: boolean) =>
                        handleUpdateVideo(video._id, { active: checked })
                      }
                    />
                    <Label>Ativo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUpdateVideo(video._id, { order: video.order - 1 })
                      }
                      disabled={video.order === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUpdateVideo(video._id, { order: video.order + 1 })
                      }
                      disabled={video.order === videos.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
