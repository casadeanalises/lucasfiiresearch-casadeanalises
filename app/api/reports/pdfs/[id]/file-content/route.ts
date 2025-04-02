import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma, { queryWithRetry } from "@/app/lib/prisma"; // Importar a instância compartilhada do Prisma

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Buscar o conteúdo do arquivo usando queryWithRetry
    const result = await queryWithRetry(async () => {
      return await prisma.$queryRaw`
        SELECT "fileContent" FROM "Report" 
        WHERE "id" = ${Number(id)} AND type = 'pdf'
      `;
    });

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return NextResponse.json(
        { message: "Conteúdo não encontrado" },
        { status: 404 },
      );
    }

    const fileContent =
      Array.isArray(result) && result.length > 0
        ? (result[0] as { fileContent: string | null }).fileContent
        : null;

    if (!fileContent) {
      return NextResponse.json(
        { message: "Conteúdo não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ fileContent });
  } catch (error) {
    console.error("Erro ao buscar o conteúdo do arquivo:", error);
    return NextResponse.json(
      { message: "Erro ao buscar o conteúdo do arquivo", error },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { fileContent } = await request.json();

    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Atualizar o conteúdo do arquivo usando queryWithRetry
    await queryWithRetry(async () => {
      return await prisma.$executeRaw`
        UPDATE "Report"
        SET "fileContent" = ${fileContent}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = ${Number(id)}
      `;
    });

    return NextResponse.json({
      message: "Conteúdo do arquivo atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar o conteúdo do arquivo:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar o conteúdo do arquivo", error },
      { status: 500 },
    );
  }
}
