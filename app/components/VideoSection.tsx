"use client";

import { useState, useEffect } from "react";
import { HomeVideo } from "@/app/types/homevideo";
import styles from "./VideoSection.module.css";

export default function VideoSection() {
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("Iniciando busca de vídeos no componente...");
        setLoading(true);
        setError(null);

        const response = await fetch("/api/videos");
        console.log("Status da resposta:", response.status);

        if (!response.ok) {
          throw new Error(`Erro ao buscar vídeos: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        if (!data.videos || !Array.isArray(data.videos)) {
          throw new Error("Formato de dados inválido");
        }

        setVideos(data.videos);
        console.log("Vídeos carregados com sucesso:", data.videos.length);
      } catch (err) {
        console.error("Erro ao buscar vídeos:", err);
        setError(
          "Erro ao carregar os vídeos. Por favor, tente novamente mais tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Carregando vídeos...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!videos.length) {
    return (
      <div className={styles.noVideos}>Nenhum vídeo disponível no momento.</div>
    );
  }

  return (
    <section className={styles.videoSection}>
      <h2>Vídeos</h2>
      <div className={styles.videoGrid}>
        {videos.map((video) => (
          <div key={video._id} className={styles.videoCard}>
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                className={styles.thumbnail}
              />
            ) : (
              <div className={styles.placeholderThumbnail}>Sem thumbnail</div>
            )}
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.watchButton}
            >
              Assistir
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
