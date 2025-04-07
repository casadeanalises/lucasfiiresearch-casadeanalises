import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Video from "@/app/models/Video";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";

// Listar vídeos
export async function GET() {
  try {
    // Verifica autenticação
    const token = cookies().get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    let payload;
    try {
      payload = await verifyJWT(token);
      if (!payload || payload.type !== "admin") {
        throw new Error("Token inválido");
      }
    } catch (err) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    await connectDB();

    // Busca todos os vídeos ordenados por ordem
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Erro ao listar vídeos:", error);
    return NextResponse.json(
      { message: "Erro ao listar vídeos" },
      { status: 500 },
    );
  }
}

// Adicionar vídeo
export async function POST(request: Request) {
  try {
    const { title, description, videoId, order, active } = await request.json();

    if (!title || !description || !videoId) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 },
      );
    }

    await connectDB();

    // Gera a URL da thumbnail usando o ID do vídeo
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const video = await Video.create({
      title,
      description,
      videoId,
      thumbnail,
      order: order || 0,
      active: active ?? true,
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    return NextResponse.json({ error: "Erro ao criar vídeo" }, { status: 500 });
  }
}
