import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId, sessionClaims } = auth();
    if (!userId) {
      return NextResponse.json({ isAdmin: false });
    }

    const userEmail = sessionClaims?.email as string;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || !userEmail) {
      return NextResponse.json({ isAdmin: false });
    }

    const isAdmin = userEmail.toLowerCase() === adminEmail.toLowerCase();

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Erro ao verificar acesso administrativo:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
