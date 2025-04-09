import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReportsLayoutClient } from "./_components/reports-layout-client";

export default async function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) {
    return null;
  }

  const user = await clerkClient.users.getUser(userId);

  // Verifica se o usuário tem plano premium
  if (user.publicMetadata.subscriptionPlan !== "premium") {
    redirect("/subscription?message=subscription-required");
  }

  return <ReportsLayoutClient>{children}</ReportsLayoutClient>;
}
