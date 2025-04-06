import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import HomeVideo from "@/app/models/HomeVideo";

// Função auxiliar para verificar se o usuário é admin
async function isAdmin() {
  try {
    const user = await currentUser();
    if (!user) return false;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return false;

    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) return false;

    return userEmail.toLowerCase() === adminEmail.toLowerCase();
  } catch (error) {
    console.error("Erro ao verificar admin:", error);
    return false;
  }
}

// GET - Listar todos os vídeos
export async function GET() {
  try {
    await connectDB();
    const videos = await HomeVideo.find().sort({ order: 1 });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vídeos" },
      { status: 500 },
    );
  }
}

// POST - Adicionar novo vídeo
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    // Extrair ID do vídeo da URL do YouTube
    let videoId = data.videoId;
    if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
      videoId = videoId.split("v=")[1] || videoId.split("/").pop();
      if (videoId.includes("?")) {
        videoId = videoId.split("?")[0];
      }
    }

    // Gerar thumbnail se não fornecida
    const thumbnail =
      data.thumbnail || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

    const video = await HomeVideo.create({
      ...data,
      videoId,
      thumbnail,
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    return NextResponse.json({ error: "Erro ao criar vídeo" }, { status: 500 });
  }
}

// PUT - Atualizar vídeo
export async function PUT(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const { id, ...updateData } = data;

    const video = await HomeVideo.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!video) {
      return NextResponse.json(
        { error: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Erro ao atualizar vídeo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar vídeo" },
      { status: 500 },
    );
  }
}

// DELETE - Remover vídeo
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    await connectDB();
    const video = await HomeVideo.findByIdAndDelete(id);

    if (!video) {
      return NextResponse.json(
        { error: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Vídeo removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover vídeo:", error);
    return NextResponse.json(
      { error: "Erro ao remover vídeo" },
      { status: 500 },
    );
  }
}
