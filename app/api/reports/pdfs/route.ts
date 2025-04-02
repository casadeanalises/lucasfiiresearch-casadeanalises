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

    // Buscar todos os PDFs
    const reports = await prisma.report.findMany({
      where: {
        type: "pdf",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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

    // Obter dados do corpo da requisição
    const data = await request.json();

    // Criar relatório no banco de dados
    const report = await prisma.report.create({
      data: {
        title: data.title,
        description: data.description,
        author: data.author,
        date: data.date,
        time: data.time,
        code: data.code,
        type: "pdf",
        thumbnail: data.thumbnail || "",
        premium: data.premium || false,
        tags: Array.isArray(data.tags) ? data.tags.join(",") : "",
        pageCount: data.pageCount || 0,
        month: data.month,
        year: data.year,
        url: data.url || null,
        fileContent: data.fileContent || null,
        createdById: userId,
      },
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
