import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Buscar todos os vídeos
    const videos = await prisma.report.findMany({
      where: {
        type: "video",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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

    // Obter dados do corpo da requisição
    const data = await request.json();

    // Campos padrão para a criação do relatório
    const reportData = {
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
      time: data.time,
      code: data.code,
      type: "video",
      thumbnail: data.thumbnail || "",
      premium: data.premium || false,
      tags: Array.isArray(data.tags) ? data.tags.join(",") : "",
      month: data.month,
      year: data.year,
      createdById: userId,
      updatedAt: new Date(),
    };

    // Adicionar campos extras se fornecidos
    if (data.videoId)
      reportData["videoId" as keyof typeof reportData] = data.videoId;
    if (data.dividendYield)
      reportData["dividendYield" as keyof typeof reportData] =
        data.dividendYield;
    if (data.price) reportData["price" as keyof typeof reportData] = data.price;

    // Criar vídeo no banco de dados
    const video = await prisma.report.create({
      data: reportData as any,
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
