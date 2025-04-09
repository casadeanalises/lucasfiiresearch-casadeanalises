import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LoggedInHome } from "./(home)/LoggedInHome";

// Força renderização dinâmica
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  return <LoggedInHome />;
}
