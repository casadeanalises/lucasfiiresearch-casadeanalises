"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { PlayCircle, Clock, Calendar, User, X } from "lucide-react";

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  author: string;
  date: string;
  time: string;
  premium: boolean;
  tags: string[];
}

export function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/reports");
        if (!response.ok) {
          throw new Error("Erro ao carregar os vídeos");
        }
        const data = await response.json();
        setVideos(data.videos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
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

  if (!videos.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        Nenhum vídeo encontrado.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card
            key={video._id}
            className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-video">
              <img
                src={
                  video.thumbnail ||
                  `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
                }
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle className="h-16 w-16 text-white" />
              </div>
              {video.premium && (
                <span className="absolute right-2 top-2 rounded-full bg-yellow-500 px-3 py-1 text-sm font-medium text-white shadow-lg">
                  Premium
                </span>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-lg">
                {video.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {video.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="truncate">{video.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{video.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{video.time}</span>
                </div>
              </div>
              {video.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
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

      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          {selectedVideo && (
            <>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-t-lg"
                />
              </div>
              <div className="bg-gradient-to-b from-background to-background/80 p-6 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="mb-2 text-2xl">
                    {selectedVideo.title}
                  </DialogTitle>
                  <p className="text-muted-foreground">
                    {selectedVideo.description}
                  </p>
                </DialogHeader>
                <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">Autor:</span>
                    <span className="text-muted-foreground">
                      {selectedVideo.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Data:</span>
                    <span className="text-muted-foreground">
                      {selectedVideo.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Duração:</span>
                    <span className="text-muted-foreground">
                      {selectedVideo.time}
                    </span>
                  </div>
                </div>
                {selectedVideo.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedVideo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
