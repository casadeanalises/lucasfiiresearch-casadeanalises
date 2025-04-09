import { currentUser } from "@clerk/nextjs";
import HomeVideosAdminClient from "./home-videos-admin-client";

export default async function HomeVideosPage() {
  const user = await currentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <HomeVideosAdminClient />
    </div>
  );
}
