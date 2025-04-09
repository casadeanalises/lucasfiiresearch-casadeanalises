import { AuthWrapper } from "./_components/AuthWrapper";

// Força renderização dinâmica
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Home() {
  return <AuthWrapper />;
}
