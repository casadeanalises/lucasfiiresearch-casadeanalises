import { cookies } from "next/headers";
import HomePage from "./(home)/page";
import { LoggedInHome } from "./(home)/LoggedInHome";

export default function Home() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.has("__session");

  if (isAuthenticated) {
    return <LoggedInHome />;
  }

  return <HomePage />;
}
