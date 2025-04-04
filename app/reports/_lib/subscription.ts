import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function checkUserSubscription() {
  const { userId } = await auth();
  console.log("Verificando assinatura para userId:", userId);

  if (!userId) {
    console.log("Usuário não autenticado");
    return { userId: null, hasSubscription: false };
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: "active",
    },
  });

  console.log("Assinatura encontrada:", subscription);

  return {
    userId,
    hasSubscription: !!subscription,
  };
}
