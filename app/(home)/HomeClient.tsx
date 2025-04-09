"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button, buttonVariants } from "../_components/ui/button";
import { useAuth } from "@clerk/nextjs";
import {
  BarChart3Icon,
  TrendingUpIcon,
  ShieldIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  BarChart2Icon,
  LineChartIcon,
  PieChartIcon,
  UserIcon,
  PlayCircleIcon,
} from "lucide-react";
import Footer from "../_components/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { LoggedInHome } from "./LoggedInHome";
import { cn } from "../_lib/utils";

export function HomeClient() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  if (isSignedIn) {
    return <LoggedInHome />;
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* === Hero Section === */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-32 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
          <div className="space-y-6" data-aos="fade-right">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              CasaDeAnálises | Lucas FII
            </div>
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              {isSignedIn
                ? "Bem-vindo de volta!"
                : "Seja Bem Vindo a CasaDeAnálises!"}{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                {isSignedIn
                  ? "Vamos analisar o mercado?"
                  : "VENHA APRENDER A INVESTIR COM SABEDORIA!"}
              </span>
            </h1>
            <p className="text-lg text-slate-300">
              {isSignedIn
                ? "Continue suas análises e acompanhe as últimas atualizações do mercado. Temos novos conteúdos exclusivos para você!"
                : "À plataforma Casa de Análises do Lucas FII! Aqui você encontra análises completas e aprofundadas sobre Fundos Imobiliários (FIIs), tendências do mercado, oportunidades de investimento e muito mais."}
            </p>
          </div>
          <div className="relative h-[400px] md:h-[500px]" data-aos="fade-left">
            <div className="absolute -left-10 -top-10 h-full w-full rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/20 blur-xl"></div>
            <Image
              src={isSignedIn ? "/dashboard-preview.png" : "/login.png"}
              alt="CasaDeAnálises | Lucas FII"
              fill
              className="relative z-10 rounded-xl object-cover shadow-2xl"
            />
            <div className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-primary"></div>
            <div className="absolute -bottom-4 -left-4 h-8 w-8 rounded-full bg-indigo-500"></div>
          </div>
        </div>

        {/* === Estatísticas rápidas === */}
        <div className="relative mx-auto mt-20 max-w-6xl px-4">
          <div
            className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:grid-cols-4"
            data-aos="fade-up"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">2k+</p>
              <p className="text-sm text-slate-300">Usuários ativos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-slate-300">FIIs analisados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">98%</p>
              <p className="text-sm text-slate-300">Satisfação</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-slate-300">Suporte</p>
            </div>
          </div>
        </div>
      </section>

      {/* === Features Section === */}
      <section className="relative w-full bg-white py-32" id="features">
        <div className="absolute inset-0 bg-[url('/dots.svg')] opacity-5"></div>
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center" data-aos="fade-up">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BarChart2Icon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold text-transparent">
              Análise completa de FIIs
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Gerencie seus Fundos de Investimento Imobiliário com inteligência
              artificial e tome decisões mais acertadas para seu patrimônio.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div
              className="group rounded-xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="mb-6 w-fit rounded-full bg-primary/10 p-4 transition-colors duration-300 group-hover:bg-primary/20">
                <BarChart3Icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Dashboard Completo</h3>
              <p className="text-slate-600">
                Visualize todos os seus investimentos em um único lugar com
                gráficos intuitivos e análises detalhadas em tempo real.
              </p>
              <div className="mt-6 flex items-center font-medium text-primary">
                <span>Saiba mais</span>
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>

            <div
              className="group rounded-xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="mb-6 w-fit rounded-full bg-primary/10 p-4 transition-colors duration-300 group-hover:bg-primary/20">
                <TrendingUpIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Análise de Tendências</h3>
              <p className="text-slate-600">
                Nossa IA analisa o mercado e identifica tendências para seus
                FIIs, trazendo insights valiosos para seu investimento.
              </p>
              <div className="mt-6 flex items-center font-medium text-primary">
                <span>Saiba mais</span>
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>

            <div
              className="group rounded-xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="mb-6 w-fit rounded-full bg-primary/10 p-4 transition-colors duration-300 group-hover:bg-primary/20">
                <ShieldIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Proteção Patrimonial</h3>
              <p className="text-slate-600">
                Alertas inteligentes sobre riscos em sua carteira para proteger
                seu patrimônio de oscilações do mercado imobiliário.
              </p>
              <div className="mt-6 flex items-center font-medium text-primary">
                <span>Saiba mais</span>
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Planos de Assinatura === */}
      <section className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-32 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center" data-aos="fade-up">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">Planos de Assinatura</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Escolha o plano ideal para suas necessidades de gestão financeira
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2" data-aos="fade-up">
            {/* Plano Básico */}
            <div className="transform overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold">Plano Básico</h3>
                <div className="flex items-end">
                  <span className="text-3xl font-semibold">R$</span>
                  <span className="mx-1 text-5xl font-bold">0</span>
                  <span className="text-slate-400">/mês</span>
                </div>
              </div>
              <div className="mb-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <p>Até 10 transações por mês</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <p>Dashboard básico</p>
                </div>
                <div className="flex items-start gap-3">
                  <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
                  <p className="text-slate-400">Relatórios de IA</p>
                </div>
                <div className="flex items-start gap-3">
                  <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
                  <p className="text-slate-400">Análise de FIIs</p>
                </div>
                <div className="flex items-start gap-3">
                  <XIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
                  <p className="text-slate-400">Suporte prioritário</p>
                </div>
              </div>
            </div>

            {/* Plano Premium */}
            <div className="relative transform overflow-hidden rounded-xl border border-primary/30 bg-white/5 p-8 shadow-lg shadow-primary/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
              <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-primary/30 blur-2xl"></div>
              <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-indigo-500/30 blur-2xl"></div>
              <div className="absolute -right-2 -top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                Popular
              </div>
              <div className="relative mb-6">
                <h3 className="mb-2 text-2xl font-bold text-primary">
                  Plano Premium
                </h3>
                <div className="flex items-end">
                  <span className="text-3xl font-semibold">R$</span>
                  <span className="mx-1 text-5xl font-bold">19</span>
                  <span className="text-slate-400">/mês</span>
                </div>
              </div>
              <div className="relative mb-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <p>Transações ilimitadas</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <p>Dashboard completo</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <p>Relatórios de IA personalizados</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <p>Análise completa de FIIs</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <p>Suporte prioritário 24/7</p>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-400">
                Todos os benefícios do plano básico + recursos premium
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
