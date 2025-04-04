import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!userId || !user) {
      console.log("Usuário não autenticado no template admin:", { userId });
      redirect("/");
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      console.log("Email não encontrado para o usuário no template admin:", {
        userId,
      });
      redirect("/");
    }

    if (!adminEmail) {
      console.log("ADMIN_EMAIL não configurado no template admin");
      redirect("/");
    }

    const isAdmin = userEmail.toLowerCase() === adminEmail.toLowerCase();
    console.log("Verificando acesso admin no template:", {
      userEmail,
      isAdmin,
    });

    if (!isAdmin) {
      console.log(
        "Usuário não é admin no template admin, redirecionando para home",
      );
      redirect("/");
    }

    return children;
  } catch (error) {
    console.error("Erro no template admin:", error);
    redirect("/");
  }
}
