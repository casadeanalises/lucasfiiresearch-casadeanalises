import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, COOKIE_OPTIONS } from "@/lib/auth";

// Lista de rotas que precisam de autenticação admin
const ADMIN_PROTECTED_ROUTES = [
  "/admin", // Protege todas as rotas admin
  "/api/admin", // Protege todas as rotas api/admin
];

// Lista de rotas admin que são públicas
const ADMIN_PUBLIC_ROUTES = ["/admin/login", "/api/admin/login"];

// Middleware para rotas admin
async function adminMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Se for a página de login admin ou API de login, permite o acesso
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Para todas as outras rotas admin, apenas verifica se existe um token
  const token = request.cookies.get(COOKIE_OPTIONS.name)?.value;

  if (!token) {
    // Se não tiver token, redireciona para login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se tiver token, permite o acesso (a validação real é feita no login)
  return NextResponse.next();
}

// Middleware principal que combina Clerk e admin
export default authMiddleware({
  publicRoutes: [
    "/",
    "/(home)/(.*)",
    "/reports",
    "/admin/login",
    "/api/admin/login",
    "/api/videos",
    "/api/videos/(.*)",
    "/api/home-videos",
    "/api/home-videos/(.*)",
    "/_next/static/(.*)",
    "/favicon.ico",
    "/grid.svg",
    "/login.png",
    "/dashboard-preview.png",
    "/lucas_foto.png",
  ],
  beforeAuth: async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;

    // Se for uma rota admin
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      return adminMiddleware(req);
    }

    // Para outras rotas, continua normalmente com o Clerk
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
