import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
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
export default withClerkMiddleware((req: NextRequest) => {
  const { userId } = getAuth(req);
  const pathname = req.nextUrl.pathname;

  // Verifica se é uma rota admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return adminMiddleware(req);
  }

  // Se estiver logado e tentar acessar páginas de login/signup, redireciona para home
  if (
    userId &&
    (pathname === "/login" ||
      pathname === "/sign-in" ||
      pathname === "/sign-up")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Lista de rotas públicas
  const publicRoutes = [
    "/",
    "/login",
    "/sign-in",
    "/sign-up",
    "/api/webhook",
    "/terms",
    "/privacy",
    "/contact",
    "/favicon.ico",
    "/grid.svg",
    "/dots.svg",
    "/login.png",
    "/(home)/(.*)",
    "/api/webhooks(.*)",
    "/api/reports/pdfs/(.*)",
    "/api/reports/videos/(.*)",
  ];

  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.match(new RegExp(`^${route}$`)),
  );

  // Se for uma rota pública, permite o acesso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Se não estiver autenticado e não for rota pública, redireciona para login
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", "/");
    return NextResponse.redirect(signInUrl);
  }

  // Se estiver autenticado, permite o acesso
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
