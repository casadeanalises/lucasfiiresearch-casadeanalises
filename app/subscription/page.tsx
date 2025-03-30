import { auth, clerkClient } from "@clerk/nextjs/server";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";
import { CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { Badge } from "../_components/ui/badge";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transactions";
import SubscriptionToast from "./_components/subscription-toast";

interface SubscriptionPageProps {
  searchParams: {
    message?: string;
  };
}

const SubscriptionPage = async ({ searchParams }: SubscriptionPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const user = await clerkClient().users.getUser(userId);
  const currentMonthTransactions = await getCurrentMonthTransactions();
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan == "premium";

  return (
    <>
      <Navbar />
      <SubscriptionToast />
      <div
        className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-100 dark:bg-slate-900"
        id="subscription-page"
        data-message={searchParams.message}
      >
        <div className="w-full max-w-5xl space-y-10 px-6 py-10">
          <h1 className="text-center text-3xl font-bold">Escolha seu plano</h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Plano Básico */}
            <div className="transform overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-transform duration-300 hover:scale-[1.01] dark:border-slate-800 dark:bg-slate-950">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-8 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="mb-4 text-center text-2xl font-semibold">
                  BÁSICO
                </h2>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-medium">R$</span>
                  <span className="mx-1 text-6xl font-bold">0</span>
                  <div className="mb-1 self-end text-xl text-slate-500 dark:text-slate-400">
                    /mensal
                  </div>
                </div>
              </div>
              <div className="space-y-4 px-6 py-8">
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-slate-700 dark:text-slate-300">
                    Apenas 10 transações por mês ({currentMonthTransactions}/10)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Relatórios de IA
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Análises detalhadas de gastos
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Suporte prioritário
                  </p>
                </div>
              </div>
              <div className="px-6 pb-8">
                {!hasPremiumPlan && (
                  <button className="mt-6 w-full rounded-full border border-slate-300 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                    Plano Atual
                  </button>
                )}
              </div>
            </div>

            {/* Plano Premium */}
            <div className="relative transform overflow-hidden rounded-xl border border-primary/30 bg-slate-900 shadow-lg shadow-primary/10 transition-transform duration-300 hover:scale-[1.01]">
              {hasPremiumPlan && (
                <Badge className="absolute right-6 top-6 bg-primary/90 font-medium text-white">
                  Ativo
                </Badge>
              )}
              <div className="border-b border-slate-800 px-6 py-8">
                <h2 className="mb-4 text-center text-2xl font-semibold text-primary">
                  PREMIUM
                </h2>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-medium text-white">R$</span>
                  <span className="mx-1 text-6xl font-bold text-white">19</span>
                  <div className="mb-1 self-end text-xl text-slate-400">
                    /mensal
                  </div>
                </div>
              </div>
              <div className="space-y-4 px-6 py-8">
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-slate-300">Transações ilimitadas</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-slate-300">
                    Relatórios de IA personalizados
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-slate-300">
                    Análises detalhadas de gastos
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-slate-300">Suporte prioritário 24/7</p>
                </div>
              </div>
              <div className="px-6 pb-8">
                <AcquirePlanButton />
                <p className="mt-4 text-center text-xs text-slate-500">
                  Todos os benefícios do plano básico + recursos premium
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
