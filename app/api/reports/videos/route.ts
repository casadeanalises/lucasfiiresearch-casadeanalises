import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import Report from "@/app/models/Report";

export async function GET(request: Request) {
  try {
    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    await connectDB();

    // Buscar todos os vídeos
    const videos = await Report.find({
      type: "video",
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar vídeos", error },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    await connectDB();

    // Obter dados do corpo da requisição
    const data = await request.json();

    // Criar vídeo no banco de dados
    const video = await Report.create({
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
      time: data.time,
      code: data.code,
      type: "video",
      thumbnail: data.thumbnail || "",
      premium: data.premium || false,
      tags: Array.isArray(data.tags) ? data.tags : [],
      month: data.month,
      year: data.year,
      videoId: data.videoId || null,
      dividendYield: data.dividendYield || null,
      price: data.price || null,
      createdById: userId,
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao criar vídeo", error },
      { status: 500 },
    );
  }
}
