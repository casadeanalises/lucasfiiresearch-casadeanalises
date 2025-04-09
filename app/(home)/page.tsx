import { auth } from "@clerk/nextjs";
import { HomeWrapper } from "../_components/HomeWrapper";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { userId } = auth();

  return <HomeWrapper isAuthenticated={!!userId} />;
}
