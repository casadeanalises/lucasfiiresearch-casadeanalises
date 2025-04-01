"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "../_components/ui/button";
import {
  // LogInIcon,
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
} from "lucide-react";
// import { SignInButton } from "@clerk/nextjs";
// import Link from "next/link";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import AOS from "aos";
import "aos/dist/aos.css";

// TODO:This component will accept userId parameter when auth is implemented
const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />

      {/* === Hero Section === */}

      <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-32 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>

        {/* === Formas decorativas === */}

        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
          <div className="space-y-6" data-aos="fade-right">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              CasaDeAnálises | Lucas FII
            </div>
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              Seja Bem Vindo a CasaDeAnálises!{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                VENHA APRENDER A INVESTIR COM SABEDORIA!
              </span>
            </h1>
            <p className="text-lg text-slate-300">
              À plataforma Casa de Análises do Lucas FII! Aqui você encontra
              análises completas e aprofundadas sobre Fundos Imobiliários
              (FIIs), tendências do mercado, oportunidades de investimento e
              muito mais.
            </p>

            {/* TODO:  <div className="flex flex-wrap gap-4">
              {!userId ? (
                <SignInButton>
                  <Button
                    size="lg"
                    className="rounded-full bg-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90"
                  >
                    <LogInIcon className="mr-2 h-4 w-4" />
                    Criar conta grátis
                  </Button>
                </SignInButton>
              ) : (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90"
                  >
                    <BarChart3Icon className="mr-2 h-4 w-4" />
                    Acessar Dashboard
                  </Button>
                </Link>
              )}
              {!userId ? (
                <SignInButton>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-white/20 transition-all duration-300 hover:bg-white/10"
                  >
                    Conheça nossos planos
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </SignInButton>
              ) : (
                <Link href="/subscription">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-white/20 transition-all duration-300 hover:bg-white/10"
                  >
                    Conheça nossos planos
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div> */}
          </div>
          <div className="relative h-[400px] md:h-[500px]" data-aos="fade-left">
            <div className="absolute -left-10 -top-10 h-full w-full rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/20 blur-xl"></div>
            <Image
              src="/login.png"
              alt="CasaDeAnálises | Lucas FII"
              fill
              className="relative z-10 rounded-xl object-cover shadow-2xl"
            />
            {/* === Elementos decorativos em torno da imagem === */}

            <div className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-primary"></div>
            <div className="absolute -bottom-4 -left-4 h-8 w-8 rounded-full bg-indigo-500"></div>
          </div>
        </div>

        {/* === Estatísticas rápidas - Adiciona credibilidade === */}

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

      {/* === Features Section - Com ícones maiores e card design mais moderno === */}

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

      {/* === FIIs em Destaque - Nova seção === */}

      <section className="w-full bg-slate-50 py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center" data-aos="fade-up">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <PieChartIcon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold text-transparent">
              FIIs em Destaque
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Conheça alguns dos FIIs mais populares analisados pela nossa
              plataforma
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {/* === Cards de FIIs populares === */}

            {["KNCR11", "MXRF11", "HGLG11", "XPLG11"].map((fii, index) => (
              <div
                key={fii}
                className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
                data-aos="fade-up"
                data-aos-delay={100 * index}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xl font-bold">{fii}</span>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${index % 2 === 0 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                  >
                    {index % 2 === 0 ? "Renda" : "Tijolo"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Dividend Yield</span>
                    <span className="font-medium">
                      {index === 0
                        ? "8.45"
                        : index === 1
                          ? "9.12"
                          : index === 2
                            ? "7.89"
                            : "8.76"}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Valor Patrimonial</span>
                    <span className="font-medium">
                      R${" "}
                      {index === 0
                        ? "97.50"
                        : index === 1
                          ? "105.30"
                          : index === 2
                            ? "86.75"
                            : "92.18"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Liquidez Diária</span>
                    <span className="font-medium">
                      R${" "}
                      {index === 0
                        ? "1.250.000"
                        : index === 1
                          ? "3.780.000"
                          : index === 2
                            ? "980.000"
                            : "2.450.000"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 h-[60px]">
                  <div className="relative h-full w-full">
                    <svg viewBox="0 0 100 20" className="h-full w-full">
                      <path
                        d={
                          index === 0
                            ? "M 0,10 L 5,12 L 10,11 L 15,13 L 20,14 L 25,12 L 30,13 L 35,11 L 40,10 L 45,9 L 50,11 L 55,12 L 60,14 L 65,13 L 70,12 L 75,10 L 80,9 L 85,11 L 90,13 L 95,12"
                            : index === 1
                              ? "M 0,12 L 5,11 L 10,10 L 15,9 L 20,8 L 25,10 L 30,9 L 35,7 L 40,8 L 45,9 L 50,10 L 55,9 L 60,8 L 65,7 L 70,8 L 75,9 L 80,11 L 85,10 L 90,9 L 95,8"
                              : index === 2
                                ? "M 0,8 L 5,9 L 10,11 L 15,10 L 20,9 L 25,8 L 30,9 L 35,10 L 40,12 L 45,11 L 50,10 L 55,9 L 60,8 L 65,9 L 70,10 L 75,12 L 80,11 L 85,10 L 90,9 L 95,10"
                                : "M 0,10 L 5,9 L 10,8 L 15,7 L 20,8 L 25,9 L 30,10 L 35,12 L 40,11 L 45,9 L 50,8 L 55,9 L 60,10 L 65,11 L 70,12 L 75,11 L 80,10 L 85,9 L 90,8 L 95,9"
                        }
                        fill="none"
                        stroke={index % 2 === 0 ? "#10b981" : "#3b82f6"}
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>

                {/* TODO:<div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-lg border-primary/20 text-primary hover:bg-primary/5"
                  >
                    Ver análise completa
                  </Button>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Vídeos do Youtube - Nova seção === */}

      <section className="w-full bg-white py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center" data-aos="fade-up">
            <h2 className="mb-8 text-4xl font-bold">Vídeos do Youtube</h2>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                <iframe
                  id="mainVideoPlayer"
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/cxO_bmcRSGs"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div
              className="flex flex-col justify-between"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3 className="mb-6 text-2xl font-bold">
                Mais vídeos sobre FIIs
              </h3>

              <div className="space-y-4">
                {[
                  {
                    id: "cxO_bmcRSGs",
                    title: "#IRDM11 - SEGUE DEVAGAR!",
                    thumbnail:
                      "https://img.youtube.com/vi/cxO_bmcRSGs/mqdefault.jpg",
                    date: "30/03/25",
                  },
                  {
                    id: "7jE7yJpNRk0",
                    title: "#KNHF11 - SEGUE VENDENDO TIJOLO!",
                    thumbnail:
                      "https://img.youtube.com/vi/7jE7yJpNRk0/mqdefault.jpg",
                    date: "29/03/25",
                  },
                  {
                    id: "haoc0d4YArk",
                    title: "#ICRI11 - DA PRA SUBIR ESSE RENDIMENTO HEIN!?",
                    thumbnail:
                      "https://img.youtube.com/vi/haoc0d4YArk/mqdefault.jpg",
                    date: "29/03/25",
                  },
                  {
                    id: "09BBpgWvgTA",
                    title: "#HGRE11 - CONTINUA DE GRAÇA!",
                    thumbnail:
                      "https://img.youtube.com/vi/09BBpgWvgTA/mqdefault.jpg",
                    date: "29/03/25",
                  },
                ].map((video, index) => (
                  <div
                    key={index}
                    id={`video-card-${video.id}`}
                    className={`group flex cursor-pointer items-center gap-4 rounded-lg p-2 transition-all hover:bg-slate-50 ${
                      index === 0
                        ? "border-l-4 border-primary bg-primary/10"
                        : ""
                    }`}
                    onClick={() => {
                      const player = document.getElementById(
                        "mainVideoPlayer",
                      ) as HTMLIFrameElement;
                      if (player) {
                        player.src = `https://www.youtube.com/embed/${video.id}?autoplay=1`;
                      }

                      document
                        .querySelectorAll('[id^="video-card-"]')
                        .forEach((el) => {
                          el.classList.remove(
                            "bg-primary/10",
                            "border-l-4",
                            "border-primary",
                          );
                        });

                      const currentVideo = document.getElementById(
                        `video-card-${video.id}`,
                      );
                      if (currentVideo) {
                        currentVideo.classList.add(
                          "bg-primary/10",
                          "border-l-4",
                          "border-primary",
                        );
                      }
                    }}
                  >
                    <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 transition-all group-hover:bg-black/0"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition-transform duration-300 group-hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 transition-all group-hover:text-primary">
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-500">{video.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <a
                  href="https://www.youtube.com/@lucasfiis"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="rounded-full bg-black px-10 text-white shadow-md hover:bg-black/90"
                    size="lg"
                  >
                    Mais Vídeos
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Planos de Assinatura - Modernizado === */}

      <section
        className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-32 text-white"
        id="pricing"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        {/* === Formas decorativas === */}

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

              {/* TODO: <SignInButton>
                <Button className="w-full rounded-full border-white/20 bg-white/10 py-6 transition-all duration-300 hover:bg-white/20">
                  Começar Grátis
                </Button>
              </SignInButton> */}
            </div>

            {/* === Plano Premium === */}
            <div
              className="relative transform overflow-hidden rounded-xl border border-primary/30 bg-white/5 p-8 shadow-lg shadow-primary/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-primary/30 blur-2xl"></div>
              <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-indigo-500/30 blur-2xl"></div>

              {/* Badge "Popular" */}
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

              {/* TODO: {!userId ? (
                <SignInButton>
                  <Button className="relative w-full rounded-full bg-primary py-6 text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90">
                    Seja Membro
                  </Button>
                </SignInButton>
              ) : (
                <Link href="/subscription">
                  <Button className="relative w-full rounded-full bg-primary py-6 text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90">
                    Seja Membro
                  </Button>
                </Link>
              )} */}
              <p className="mt-4 text-center text-xs text-slate-400">
                Todos os benefícios do plano básico + recursos premium
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === Seção de Relatórios e Análises === */}

      <section className="w-full bg-white py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center" data-aos="fade-up">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LineChartIcon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold text-transparent">
              Relatórios e Análises Avançadas
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Descubra como nossos relatórios inteligentes podem transformar sua
              forma de investir
            </p>
          </div>

          <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="order-2 md:order-1" data-aos="fade-right">
              <h3 className="mb-4 text-2xl font-bold">Análise de Desempenho</h3>
              <p className="mb-6 text-slate-600">
                Nossos relatórios utilizam algoritmos avançados para analisar o
                desempenho histórico de FIIs, identificando padrões e tendências
                que poderiam passar despercebidos.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <CheckIcon className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-slate-600">
                    Comparação com índices de referência
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <CheckIcon className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-slate-600">
                    Análise de volatilidade e risco
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <CheckIcon className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-slate-600">
                    Projeções baseadas em machine learning
                  </p>
                </li>
              </ul>

              {/* TODO:<Button className="mt-6 rounded-full" variant="outline">
                Ver exemplo de relatório
              </Button> */}
            </div>
            <div className="relative order-1 md:order-2" data-aos="fade-left">
              <div className="absolute -left-10 -top-10 h-full w-full rounded-2xl bg-gradient-to-br from-primary/5 to-indigo-500/5 blur-xl"></div>
              <div className="relative rounded-xl bg-white p-4 shadow-2xl">
                <Image
                  src="/login.png"
                  alt="Exemplo de relatório"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>

              {/* === Elementos decorativos === */}

              <div className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-primary"></div>
              <div className="absolute -bottom-4 -left-4 h-8 w-8 rounded-full bg-indigo-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* === Por que escolher a CasaDeAnálises? === */}

      <section className="w-full bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center" data-aos="fade-up">
            <h2 className="mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold text-transparent">
              Por que escolher a CasaDeAnálises?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Nossa plataforma combina tecnologia de ponta com análise
              financeira para otimizar seus investimentos.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div
              className="rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <h3 className="mb-4 text-xl font-bold text-primary">
                Respaldado por especialistas
              </h3>
              <p className="mb-4 text-slate-600">
                Nossa equipe inclui analistas financeiros experientes que
                supervisionam os algoritmos de IA.
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
                  Profissionais certificados CFA
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
                  Especialistas em mercado imobiliário
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
                  Mais de 10 anos de experiência no mercado
                </li>
              </ul>
            </div>

            <div
              className="rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3 className="mb-4 text-xl font-bold">Tecnologia avançada</h3>
              <p className="mb-4 text-slate-600">
                Utilizamos algoritmos de machine learning e processamento de
                linguagem natural de última geração.
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
                  Atualização de dados em tempo real
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
                  Análise preditiva de tendências
                </li>
                <li className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
                  Algoritmos de otimização de portfólio
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
