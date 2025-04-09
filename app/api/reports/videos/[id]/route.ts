import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import Report from "@/app/models/Report";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

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

    await connectDB();

    // Buscar o vídeo específico por ID
    const video = await Report.findOne({
      _id: id,
      type: "video",
    }).lean();

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

    await connectDB();

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
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in data) {
        if (field === "tags" && Array.isArray(data[field])) {
          updateData[field] = data[field];
        } else {
          updateData[field] = data[field];
        }
      }
    }

    // Atualizar o vídeo
    const updatedVideo = await Report.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).lean();

    if (!updatedVideo) {
      return NextResponse.json(
        { message: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

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
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress;

    if (!isAdmin(userEmail)) {
      console.log("Usuário não é admin:", { userEmail });
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;

    const video = await prisma.report.delete({
      where: {
        id: id,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Vídeo excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir vídeo:", error);
    return NextResponse.json(
      { error: "Erro ao excluir vídeo" },
      { status: 500 },
    );
  }
}
