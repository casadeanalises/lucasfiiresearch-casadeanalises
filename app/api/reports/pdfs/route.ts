import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

async function checkSubscription(userId: string | null) {
  if (!userId) return false;

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: "active",
    },
  });

  return !!subscription;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await clerkClient().users.getUser(userId);

    // Verifica se o usuário tem plano premium
    if (user.publicMetadata.subscriptionPlan !== "premium") {
      return NextResponse.json(
        { error: "Necessário ter um plano premium" },
        { status: 403 },
      );
    }

    const reports = await prisma.report.findMany({
      where: {
        type: "pdf",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("PDFs encontrados:", reports);
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Erro ao buscar PDFs:", error);
    return NextResponse.json({ error: "Erro ao buscar PDFs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await clerkClient().users.getUser(userId);

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!isAdmin(userEmail)) {
      console.log("Usuário não é admin:", { userEmail });
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await request.json();

    const pdf = await prisma.report.create({
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
        tags: Array.isArray(data.tags) ? data.tags : [],
        month: data.month,
        year: data.year,
        url: data.url || null,
        pageCount: data.pageCount || null,
        dividendYield: data.dividendYield || null,
        price: data.price || null,
      },
    });

    return NextResponse.json(pdf);
  } catch (error) {
    console.error("Erro ao criar PDF:", error);
    return NextResponse.json({ error: "Erro ao criar PDF" }, { status: 500 });
  }
}
