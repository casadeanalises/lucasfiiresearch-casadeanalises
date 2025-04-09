import { redirect } from "next/navigation";

// Força renderização dinâmica
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function HomePage() {
  redirect("/");
}
