import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import { isMatch } from "date-fns";
import { getDashboard } from "../_data/get-dashboard";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import FIISearch from "./_components/fii-search";
import dynamic from "next/dynamic";

// Componentes carregados dinamicamente para evitar problemas com SSR
const FIIPortfolio = dynamic(() => import("./_components/fii-portfolio"), {
  ssr: false,
});
const FIIChart = dynamic(() => import("./_components/fii-chart"), {
  ssr: false,
});

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const user = await clerkClient().users.getUser(userId);
  // Check if user has premium subscription
  if (user.publicMetadata.subscriptionPlan !== "premium") {
    redirect("/subscription?message=subscription-required");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`);
  }

  await getDashboard(month);
  await canUserAddTransaction();

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col overflow-y-auto bg-slate-50 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">
              Dashboard de FIIs
            </h1>
            <p className="text-sm text-slate-500">
              Acompanhe, analise e gerencie seus investimentos em Fundos
              Imobiliários
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <span className="text-sm font-medium">IFIX:</span>
              <span className="text-sm font-bold text-green-600">3.254,78</span>
              <span className="text-xs text-green-600">+0.8%</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <span className="text-sm font-medium">Selic:</span>
              <span className="text-sm font-bold">10,50%</span>
            </div>
          </div>
        </div>

        {/* Componente de Busca */}
        <div className="mb-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Buscar FII</h2>
            <FIISearch />
          </div>
        </div>

        {/* Gráficos e Análises */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">
              Análise de Desempenho
            </h2>
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="text-sm text-blue-600">Valor Total em FIIs</div>
                <div className="text-xl font-bold">R$ 25.342,50</div>
                <div className="text-xs text-blue-600">+2,3% em 30 dias</div>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <div className="text-sm text-green-600">
                  DY Médio da Carteira
                </div>
                <div className="text-xl font-bold">0,84%</div>
                <div className="text-xs text-green-600">10,08% ao ano</div>
              </div>
              <div className="rounded-lg bg-orange-50 p-3">
                <div className="text-sm text-orange-600">P/VP Médio</div>
                <div className="text-xl font-bold">0,98</div>
                <div className="text-xs text-orange-600">
                  Abaixo de 1 = desconto
                </div>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <div className="text-sm text-purple-600">Liquidez Média</div>
                <div className="text-xl font-bold">R$ 6,2M</div>
                <div className="text-xs text-purple-600">
                  Valor negociado / dia
                </div>
              </div>
            </div>
            <div className="mt-4">
              <FIIChart />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Comparação de FIIs</h2>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <div className="font-medium">HGLG11</div>
                  <div className="text-sm text-green-600">+2,34%</div>
                </div>
                <div className="mb-2 text-sm text-gray-600">Logística</div>
                <div className="flex justify-between text-sm">
                  <div>R$ 172,05</div>
                  <div>DY: 0,78%</div>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <div className="font-medium">MXRF11</div>
                  <div className="text-sm text-green-600">+1,15%</div>
                </div>
                <div className="mb-2 text-sm text-gray-600">Recebíveis</div>
                <div className="flex justify-between text-sm">
                  <div>R$ 10,25</div>
                  <div>DY: 1,12%</div>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <div className="font-medium">HGBS11</div>
                  <div className="text-sm text-green-600">+2,15%</div>
                </div>
                <div className="mb-2 text-sm text-gray-600">Shopping</div>
                <div className="flex justify-between text-sm">
                  <div>R$ 205,75</div>
                  <div>DY: 0,76%</div>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <div className="font-medium">KNRI11</div>
                  <div className="text-sm text-green-600">+1,85%</div>
                </div>
                <div className="mb-2 text-sm text-gray-600">
                  Lajes Corporativas
                </div>
                <div className="flex justify-between text-sm">
                  <div>R$ 132,40</div>
                  <div>DY: 0,65%</div>
                </div>
              </div>
            </div>

            <div className="mb-4 rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-medium">Destaques da Semana</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  XPLG11 anunciou aquisição de galpão logístico por R$ 82
                  milhões
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  HGLG11 distribuiu rendimentos de R$ 1,25 por cota (DY de
                  0,78%)
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                  RECT11 apresentou queda na taxa de ocupação para 92,5%
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">
                Dados atualizados em:{" "}
                <span className="font-medium">06/07/2023</span>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                Ver relatórios detalhados
              </button>
            </div>
          </div>
        </div>

        {/* Carteira de FIIs */}
        <div className="mb-6">
          <FIIPortfolio />
        </div>
      </div>
    </>
  );
};

export default Home;
