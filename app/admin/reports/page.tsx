import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ReportsAdminClient from "./reports-admin-client";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Obter parâmetro 'add' da URL
  const addType = searchParams.add as string | undefined;

  // Definir a seção inicial com base nos parâmetros da URL
  let initialSection: "add" | "manage" = "manage";
  let initialTab: "pdf" | "video" = "pdf";

  if (addType === "pdf") {
    initialSection = "add";
    initialTab = "pdf";
  } else if (addType === "video") {
    initialSection = "add";
    initialTab = "video";
  }

  return (
    <div className="container mx-auto">
      <ReportsAdminClient
        adminEmail="admin@casadeanalises.com"
        initialSection={initialSection}
        initialTab={initialTab}
      />
    </div>
  );
}
