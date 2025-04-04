import { authMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Função para verificar se é admin
async function isAdmin(userId: string | null) {
  if (!userId) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;

  try {
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) return false;

    console.log("Verificando admin no middleware:", {
      userEmail,
      adminEmail: process.env.ADMIN_EMAIL,
    });

    return userEmail.toLowerCase() === adminEmail.toLowerCase();
  } catch (error) {
    console.error("Erro ao verificar admin:", error);
    return false;
  }
}

export default authMiddleware({
  publicRoutes: ["/", "/reports"],
  async afterAuth(auth, req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    // Se não for rota admin ou api, permite o acesso
    if (!isAdminRoute && !isApiRoute) {
      return NextResponse.next();
    }

    // Se não estiver autenticado, redireciona para login
    if (!auth.userId) {
      console.log("Usuário não autenticado, redirecionando para login");
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Se for rota admin, verifica se é admin
    if (isAdminRoute) {
      const adminCheck = await isAdmin(auth.userId);
      console.log("Resultado da verificação de admin no middleware:", {
        userId: auth.userId,
        isAdmin: adminCheck,
        path: req.nextUrl.pathname,
      });

      if (!adminCheck) {
        console.log("Usuário não é admin, redirecionando para home");
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Se chegou aqui, permite o acesso
    return NextResponse.next();
  },
});

// Atualiza o matcher para incluir apenas as rotas necessárias
export const config = {
  matcher: ["/admin/:path*", "/api/:path*", "/((?!.+\\.[\\w]+$|_next).*)"],
};
