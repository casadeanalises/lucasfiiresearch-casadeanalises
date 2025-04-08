import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const videos = await db.collection("homevideos").find({}).toArray();

    console.log("Vídeos encontrados:", videos);

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vídeos" },
      { status: 500 },
    );
  }
}
