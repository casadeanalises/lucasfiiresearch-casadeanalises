import { cookies } from "next/headers";
import HomePage from "./(home)/page";
import { LoggedInHome } from "./(home)/LoggedInHome";
import { redirect } from "next/navigation";

// Força renderização dinâmica
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Home() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.has("__session");

  if (isAuthenticated) {
    return <LoggedInHome />;
  }

  return <HomePage />;
}
