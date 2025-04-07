import * as jose from "jose";

// Chave secreta para assinar os tokens JWT (convertida para Uint8Array para jose)
const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "sua-chave-super-secreta-e-unica-123",
);

// Função para gerar token JWT
export async function signJWT(payload: any) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

// Função para verificar token JWT
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

// Configurações do cookie
export const COOKIE_OPTIONS = {
  name: "admin_token",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24, // 24 horas
};
