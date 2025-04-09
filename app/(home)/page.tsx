import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LoggedInHome } from "./LoggedInHome";

// Força renderização dinâmica
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function HomePage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  return <LoggedInHome />;
}
