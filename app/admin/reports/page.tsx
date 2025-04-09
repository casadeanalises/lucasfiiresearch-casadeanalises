import { currentUser } from "@clerk/nextjs";
import ReportsAdminClient from "./reports-admin-client";

export default async function ReportsPage() {
  const user = await currentUser();
  const adminEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Gerenciar Relatórios
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Adicione e gerencie PDFs e vídeos de análises
        </p>
      </div>

      <ReportsAdminClient adminEmail={adminEmail} />
    </div>
  );
}
