import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Extrair o ID do vídeo dos parâmetros
    const { id } = params;

    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Buscar o vídeo específico por ID
    const video = await prisma.report.findUnique({
      where: {
        id: Number(id),
        type: "video",
      },
    });

    if (!video) {
      return NextResponse.json(
        { message: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Erro ao buscar vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao buscar vídeo", error },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Extrair o ID do vídeo dos parâmetros
    const { id } = params;

    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Validar ID
    const videoId = Number(id);
    if (isNaN(videoId)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    // Obter dados do corpo da requisição
    const data = await request.json();

    // Campos permitidos para atualização
    const allowedFields = [
      "title",
      "description",
      "author",
      "date",
      "time",
      "code",
      "thumbnail",
      "premium",
      "tags",
      "month",
      "year",
      "videoId",
      "dividendYield",
      "price",
    ];

    // Filtrar apenas os campos permitidos
    const updateData: Record<string, string | number | boolean | null> = {};
    for (const field of allowedFields) {
      if (field in data) {
        if (field === "tags" && Array.isArray(data[field])) {
          updateData[field] = data[field].join(",");
        } else {
          updateData[field] = data[field];
        }
      }
    }

    // Atualizar o vídeo
    const updatedVideo = await prisma.report.update({
      where: {
        id: videoId,
      },
      data: updateData,
    });

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error("Erro ao atualizar vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar vídeo", error },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Extrair o ID do vídeo dos parâmetros
    const { id } = params;

    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Validar ID
    const videoId = Number(id);
    if (isNaN(videoId)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    // Excluir o vídeo
    await prisma.report.delete({
      where: {
        id: videoId,
      },
    });

    return NextResponse.json({ message: "Vídeo excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao excluir vídeo", error },
      { status: 500 },
    );
  }
}
