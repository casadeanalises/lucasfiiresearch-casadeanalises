import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/app/models/Admin";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    // Verifica o token do admin atual
    const token = cookies().get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    try {
      // Verifica se o token é válido
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    // Pega os dados do novo admin
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    await connectDB();

    // Verifica se já existe um admin com este email
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Já existe um admin com este email" },
        { status: 400 },
      );
    }

    // Cria o novo admin
    const admin = new Admin({
      email: email.toLowerCase(),
      password,
    });

    await admin.save();

    return NextResponse.json(
      {
        message: "Admin criado com sucesso",
        adminEmail: admin.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar admin:", error);
    return NextResponse.json(
      { message: "Erro ao criar admin" },
      { status: 500 },
    );
  }
}
