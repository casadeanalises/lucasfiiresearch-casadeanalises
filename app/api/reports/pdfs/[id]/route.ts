import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import Report from "@/app/models/Report";

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

    await connectDB();

    // Buscar o PDF específico por ID
    const pdf = await Report.findOne({
      _id: id,
      type: "pdf",
    }).lean();

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
          updateData[field] = data[field];
        } else {
          updateData[field] = data[field];
        }
      }
    }

    // Atualizar o PDF
    const updatedPdf = await Report.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).lean();

    if (!updatedPdf) {
      return NextResponse.json(
        { message: "PDF não encontrado" },
        { status: 404 },
      );
    }

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

    await connectDB();

    // Excluir o PDF
    const deletedPdf = await Report.findByIdAndDelete(id).lean();

    if (!deletedPdf) {
      return NextResponse.json(
        { message: "PDF não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "PDF excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir PDF:", error);
    return NextResponse.json(
      { message: "Erro ao excluir PDF", error },
      { status: 500 },
    );
  }
}
