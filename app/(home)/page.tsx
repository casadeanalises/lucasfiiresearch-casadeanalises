import { auth } from "@clerk/nextjs";
import { HomeClient } from "../_components/HomeClient";
import { LoggedInHome } from "../_components/LoggedInHome";

export default async function HomePage() {
  const { userId } = auth();

  // Se não estiver logado, mostra a página inicial para visitantes
  if (!userId) {
    return <HomeClient />;
  }

  // Se estiver logado, mostra a página inicial para usuários autenticados
  return <LoggedInHome />;
}
