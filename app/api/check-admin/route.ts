import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!userId || !user) {
      console.log("Usuário não autenticado:", { userId });
      return NextResponse.json(
        { isAdmin: false, message: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!userEmail || !adminEmail) {
      console.log("Email não encontrado:", { userEmail });
      return NextResponse.json(
        { isAdmin: false, message: "Email não encontrado" },
        { status: 401 },
      );
    }

    const isAdmin = userEmail.toLowerCase() === adminEmail.toLowerCase();
    console.log("Verificando acesso admin:", {
      userEmail,
      isAdmin,
    });

    return NextResponse.json({
      isAdmin,
      debug: {
        userEmail,
      },
    });
  } catch (error) {
    console.error("Erro ao verificar status de admin:", error);
    return NextResponse.json(
      { isAdmin: false, message: "Erro ao verificar status de admin" },
      { status: 500 },
    );
  }
}
