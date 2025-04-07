"use client";

import { useState, useEffect } from "react";
import { FaYoutube } from "react-icons/fa";

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  order: number;
}

export default function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos");
        if (!response.ok) throw new Error("Erro ao carregar vídeos");
        const data = await response.json();
        setVideos(data.videos);
      } catch (err) {
        setError("Erro ao carregar vídeos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading)
    return <div className="py-8 text-center">Carregando vídeos...</div>;
  if (error)
    return <div className="py-8 text-center text-red-500">{error}</div>;
  if (videos.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">Nossos Vídeos</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video._id}
              className="overflow-hidden rounded-lg bg-white shadow-lg"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100"
                >
                  <FaYoutube className="text-5xl text-red-600" />
                </a>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">{video.title}</h3>
                <p className="text-gray-600">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
