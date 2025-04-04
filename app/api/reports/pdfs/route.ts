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

    // Buscar todos os PDFs
    const reports = await Report.find({
      type: "pdf",
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Erro ao buscar PDFs:", error);
    return NextResponse.json(
      { message: "Erro ao buscar PDFs", error },
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

    // Criar relatório no banco de dados
    const report = await Report.create({
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
      time: data.time,
      code: data.code,
      type: "pdf",
      thumbnail: data.thumbnail || "",
      premium: data.premium || false,
      tags: Array.isArray(data.tags) ? data.tags : [],
      pageCount: data.pageCount || 0,
      month: data.month,
      year: data.year,
      url: data.url || null,
      fileContent: data.fileContent || null,
      createdById: userId,
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Erro ao criar PDF:", error);
    return NextResponse.json(
      { message: "Erro ao criar PDF", error },
      { status: 500 },
    );
  }
}
