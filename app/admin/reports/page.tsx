import { auth } from "@clerk/nextjs/server";
import ReportsAdminClient from "./reports-admin-client";

export default async function ReportsPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Gerenciar Relatórios
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Adicione e gerencie PDFs e vídeos de análises
        </p>
      </div>

      <ReportsAdminClient adminEmail="admin@casadeanalises.com" />
    </div>
  );
}
