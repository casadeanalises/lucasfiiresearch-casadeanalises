import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Video from "@/app/models/Video";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";

// Atualizar vídeo
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
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

    const { title, description, url, thumbnail, order, active } =
      await request.json();

    if (!title || !description || !url) {
      return NextResponse.json(
        { message: "Título, descrição e URL são obrigatórios" },
        { status: 400 },
      );
    }

    await connectDB();

    // Atualiza o vídeo
    const video = await Video.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        url,
        thumbnail,
        order: order || 0,
        active: active !== undefined ? active : true,
      },
      { new: true },
    );

    if (!video) {
      return NextResponse.json(
        { message: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

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

// Deletar vídeo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
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

    // Deleta o vídeo
    const video = await Video.findByIdAndDelete(params.id);

    if (!video) {
      return NextResponse.json(
        { message: "Vídeo não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Vídeo deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar vídeo:", error);
    return NextResponse.json(
      { message: "Erro ao deletar vídeo" },
      { status: 500 },
    );
  }
}
