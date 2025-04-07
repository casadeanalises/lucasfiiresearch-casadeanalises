import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import HomeVideo from "@/app/models/HomeVideo";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";

// Função auxiliar para verificar se o usuário é admin
async function isAdmin() {
  try {
    // Primeiro tenta com Clerk
    const user = await currentUser();
    if (user) {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) return false;

      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (!userEmail) return false;

      if (userEmail.toLowerCase() === adminEmail.toLowerCase()) {
        return true;
      }
    }

    // Se não funcionar, tenta com cookie de admin
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (token) {
      const payload = await verifyJWT(token);
      return !!payload;
    }

    return false;
  } catch (error) {
    console.error("Erro ao verificar admin:", error);
    return false;
  }
}

// GET - Listar todos os vídeos
export async function GET() {
  try {
    console.log("Iniciando busca de vídeos públicos...");

    await connectDB();
    console.log("Conectado ao MongoDB");

    // Busca todos os vídeos ordenados por ordem (para admin, mostra todos)
    const videos = await HomeVideo.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    console.log("Vídeos encontrados:", videos);

    return NextResponse.json({ videos: videos || [] });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { videos: [], message: "Erro ao buscar vídeos" },
      { status: 500 },
    );
  }
}

// POST - Adicionar novo vídeo
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    console.log("Dados recebidos:", data);

    const { title, description, videoId } = data;

    if (!title || !description || !videoId) {
      const missingFields = [];
      if (!title) missingFields.push("título");
      if (!description) missingFields.push("descrição");
      if (!videoId) missingFields.push("ID do vídeo");

      return NextResponse.json(
        {
          message: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`,
          missingFields,
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Gerar a URL da thumbnail usando o ID do vídeo
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // Criar o vídeo com os campos obrigatórios
    const video = await HomeVideo.create({
      title,
      description,
      videoId,
      thumbnail,
      order: data.order || 0,
      active: data.active ?? true,
    });

    console.log("Vídeo criado:", video);

    return NextResponse.json(
      {
        message: "Vídeo adicionado com sucesso",
        video,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao criar vídeo" },
      { status: 500 },
    );
  }
}

// PUT - Atualizar vídeo
export async function PUT(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    console.log("Dados recebidos para atualização:", data);

    const { id, order } = data;

    if (!id || order === undefined) {
      return NextResponse.json(
        { message: "ID e ordem são obrigatórios" },
        { status: 400 },
      );
    }

    await connectDB();

    const video = await HomeVideo.findByIdAndUpdate(
      id,
      { order },
      { new: true },
    );

    if (!video) {
      return NextResponse.json(
        { message: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

    console.log("Vídeo atualizado:", video);

    return NextResponse.json({
      message: "Vídeo atualizado com sucesso",
      video,
    });
  } catch (error) {
    console.error("Erro ao atualizar vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar vídeo" },
      { status: 500 },
    );
  }
}

// DELETE - Remover vídeo
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID não fornecido" },
        { status: 400 },
      );
    }

    await connectDB();

    const video = await HomeVideo.findByIdAndDelete(id);

    if (!video) {
      return NextResponse.json(
        { message: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

    console.log("Vídeo removido:", id);

    return NextResponse.json({
      message: "Vídeo removido com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao remover vídeo" },
      { status: 500 },
    );
  }
}
