import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, COOKIE_OPTIONS } from "@/lib/auth";

// Lista de rotas que precisam de autenticação admin
const ADMIN_PROTECTED_ROUTES = [
  "/admin",
  "/api/admin",
];

// Lista de rotas admin que são públicas
const ADMIN_PUBLIC_ROUTES = ["/admin/login", "/api/admin/login"];

// Middleware para rotas admin
async function adminMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_OPTIONS.name)?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default authMiddleware({
  publicRoutes: [
    "/bem-vindo",
    "/",
    "/login",
    "/sign-in",
    "/sign-up",
    "/webhook",
    "/api/webhooks/stripe",
    "/terms",
    "/privacy",
    "/contact",
    "/favicon.ico",
    "/grid.svg",
    "/dots.svg",
    "/login.png",
    "/(home)/(.*)",
    "/api/reports/pdfs/(.*)",
    "/api/reports/videos/(.*)",
  ],
  afterAuth(auth, req) {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      return adminMiddleware(req);
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL("/bem-vindo", req.url));
    }

    if (auth.userId && pathname === "/bem-vindo") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
