import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckIcon, XIcon, SparklesIcon, CreditCardIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { Badge } from "../_components/ui/badge";
import { getCurrentMonthSubscriptions } from "../_data/get-current-month-transactions";
import SubscriptionToast from "./_components/subscription-toast";
import ManageSubscriptionButton from "./_components/manage-subscription-button";

interface SubscriptionPageProps {
  searchParams: {
    message?: string;
  };
}

const SubscriptionPage = async ({ searchParams }: SubscriptionPageProps) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const user = await clerkClient.users.getUser(userId);
  const currentMonthSubscriptions = await getCurrentMonthSubscriptions();
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan == "premium";

  return (
    <>
      <SubscriptionToast />
      <div
        className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 bg-fixed"
        id="subscription-page"
        data-message={searchParams.message}
      >
        <div className="container max-w-6xl space-y-12 px-6 py-16">
          {hasPremiumPlan && (
            <div className="mb-8 rounded-2xl border border-indigo-400/20 bg-indigo-900/30 p-6 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-600">
                    <CreditCardIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Seu Plano:{" "}
                      <span className="bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
                        Premium
                      </span>
                    </h2>
                  </div>
                </div>
                <div className="flex flex-shrink-0 gap-3">
                  <ManageSubscriptionButton />
                </div>
              </div>
            </div>
          )}

          <div className="mb-16 text-center">
            <h1 className="mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-6xl font-extrabold leading-tight tracking-tighter text-transparent">
              Planos de Assinatura
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100/80">
              Acesse análises exclusivas de FIIs, relatórios detalhados e
              conteúdo em vídeo
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Plano Básico */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-white/20 hover:shadow-[0_20px_80px_-10px_rgba(120,119,198,0.3)]">
              <div className="relative z-10 p-8">
                <div className="mb-8">
                  <div className="mb-3 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 bg-opacity-10">
                      <XIcon className="h-8 w-8 text-blue-100" />
                    </div>
                  </div>
                  <h2 className="mb-2 text-center text-3xl font-bold text-white">
                    BÁSICO
                  </h2>
                  <div className="mx-auto mb-6 h-[2px] w-12 bg-gradient-to-r from-blue-400 to-transparent"></div>
                  <div className="flex items-center justify-center">
                    <span className="text-xl font-normal text-blue-200">
                      R$
                    </span>
                    <span className="mx-1 text-6xl font-bold text-white">
                      0
                    </span>
                    <div className="self-end text-lg text-blue-200">
                      /mensal
                    </div>
                  </div>
                </div>

                <div className="mb-8 space-y-5">
                  <div className="flex items-start gap-3 rounded-lg bg-white/5 p-3 transition-colors">
                    <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
                    <p className="text-blue-100">
                      Acesso a {currentMonthSubscriptions}/10 análises de FIIs
                      por mês
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-white/5 p-3 opacity-60 transition-colors">
                    <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400/50" />
                    <p className="text-blue-200/70">
                      Relatórios avançados de FIIs
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-white/5 p-3 opacity-60 transition-colors">
                    <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400/50" />
                    <p className="text-blue-200/70">
                      Vídeos explicativos e webinars
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-white/5 p-3 opacity-60 transition-colors">
                    <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400/50" />
                    <p className="text-blue-200/70">
                      Suporte especializado em investimentos
                    </p>
                  </div>
                </div>

                {!hasPremiumPlan && (
                  <button className="w-full rounded-xl border border-white/10 bg-white/5 py-4 font-medium text-white transition-all hover:bg-white/10">
                    Plano Atual
                  </button>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-800/0 via-blue-800/0 to-blue-600/5"></div>
            </div>

            {/* Plano Premium */}
            <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-900/40 to-blue-900/20 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-indigo-400/30 hover:shadow-[0_20px_80px_-10px_rgba(99,102,241,0.5)]">
              {hasPremiumPlan && (
                <Badge className="absolute right-6 top-6 z-20 bg-gradient-to-r from-indigo-500 to-blue-500 font-medium text-white shadow-lg">
                  Ativo
                </Badge>
              )}
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 translate-y-[-25%] transform rounded-full bg-indigo-500 opacity-20 blur-3xl filter"></div>

              <div className="absolute -left-16 -top-16 h-[300px] w-[300px] bg-indigo-600/10 blur-3xl"></div>

              <div className="relative z-10 p-8">
                <div className="mb-8">
                  <div className="mb-3 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600">
                      <SparklesIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="mb-2 text-center text-3xl font-bold text-white">
                    PREMIUM
                  </h2>
                  <div className="mx-auto mb-6 h-[2px] w-12 bg-gradient-to-r from-indigo-400 to-blue-400"></div>
                  <div className="flex items-center justify-center">
                    <span className="text-xl font-normal text-blue-200">
                      R$
                    </span>
                    <span className="mx-1 text-6xl font-bold text-white">
                      19
                    </span>
                    <div className="self-end text-lg text-blue-200">
                      /mensal
                    </div>
                  </div>
                </div>

                <div className="mb-8 space-y-5">
                  <div className="flex items-start gap-3 rounded-lg bg-white/10 p-3 transition-colors hover:bg-white/15">
                    <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
                    <p className="text-blue-100">Análises ilimitadas de FIIs</p>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-white/10 p-3 transition-colors hover:bg-white/15">
                    <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
                    <p className="text-blue-100">
                      Relatórios exclusivos com recomendações
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-white/10 p-3 transition-colors hover:bg-white/15">
                    <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
                    <p className="text-blue-100">
                      Acesso completo à biblioteca de vídeos
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-white/10 p-3 transition-colors hover:bg-white/15">
                    <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
                    <p className="text-blue-100">
                      Consultoria personalizada sobre FIIs
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <AcquirePlanButton />
                  <p className="mt-4 text-center text-xs text-blue-200/70">
                    Todos os benefícios do plano básico + conteúdo exclusivo
                    sobre FIIs
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 via-indigo-600/0 to-indigo-600/20"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
