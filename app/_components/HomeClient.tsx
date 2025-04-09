"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
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
import Footer from "./footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { LoggedInHome } from "../(home)/LoggedInHome";
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
            {/* ... (resto do código dos cards de features) ... */}
          </div>
        </div>
      </section>

      {/* === Planos de Assinatura === */}
      <section className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-32 text-white">
        {/* ... (resto do código dos planos) ... */}
      </section>

      <Footer />
    </div>
  );
}
