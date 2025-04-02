import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Lista de IDs de usuários ou emails que são administradores
const ADMIN_IDS = ["user_2VhTvI9jttCcNIzW6p1DNbLjm", "seu_id_do_clerk"];
const ADMIN_EMAILS = [
  "admin@casadeanalises.com",
  "lucasfii@example.com",
  "lana.santos@example.com",
];

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { isAdmin: false, message: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    // Para fins de demonstração, considerando todos os usuários como admin
    // Isso facilita testar a interface de admin
    // Em produção, use uma verificação mais restrita
    const isAdmin = true;

    // Verificação real (descomente e ajuste para produção)
    // const isAdmin = ADMIN_IDS.includes(userId) || ADMIN_EMAILS.includes(userEmail);

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Erro ao verificar status de admin:", error);
    return NextResponse.json(
      { isAdmin: false, message: "Erro ao verificar status de admin" },
      { status: 500 },
    );
  }
}
