import { currentUser } from "@clerk/nextjs/server";
import HomeVideosAdminClient from "./home-videos-admin-client";

export default async function HomeVideosPage() {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Gerenciar Vídeos da Página Inicial
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Adicione e gerencie os vídeos que aparecem na página inicial
        </p>
      </div>

      <HomeVideosAdminClient adminEmail={userEmail} />
    </div>
  );
}
