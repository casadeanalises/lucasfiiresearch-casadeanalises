import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LoggedInHome } from "../_components/LoggedInHome";

export default function HomePage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  return <LoggedInHome />;
}
