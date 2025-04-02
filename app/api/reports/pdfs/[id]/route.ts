import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Extrair o ID do PDF dos parâmetros
    const { id } = params;

    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Buscar o PDF específico por ID
    const pdf = await prisma.report.findUnique({
      where: {
        id: Number(id),
        type: "pdf",
      },
    });

    if (!pdf) {
      return NextResponse.json(
        { message: "PDF não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(pdf);
  } catch (error) {
    console.error("Erro ao buscar PDF:", error);
    return NextResponse.json(
      { message: "Erro ao buscar PDF", error },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Extrair o ID do PDF dos parâmetros
    const { id } = params;

    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Validar ID
    const pdfId = Number(id);
    if (isNaN(pdfId)) {
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
      "pageCount",
      "month",
      "year",
      "url",
    ];

    // Filtrar apenas os campos permitidos
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in data) {
        if (field === "tags" && Array.isArray(data[field])) {
          updateData[field] = data[field].join(",");
        } else {
          updateData[field] = data[field];
        }
      }
    }

    // Atualizar o PDF
    const updatedPdf = await prisma.report.update({
      where: {
        id: pdfId,
      },
      data: updateData,
    });

    return NextResponse.json(updatedPdf);
  } catch (error) {
    console.error("Erro ao atualizar PDF:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar PDF", error },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Extrair o ID do PDF dos parâmetros
    const { id } = params;

    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Validar ID
    const pdfId = Number(id);
    if (isNaN(pdfId)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    // Excluir o PDF
    await prisma.report.delete({
      where: {
        id: pdfId,
      },
    });

    return NextResponse.json({ message: "PDF excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir PDF:", error);
    return NextResponse.json(
      { message: "Erro ao excluir PDF", error },
      { status: 500 },
    );
  }
}
