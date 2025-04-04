"use client";

import { useEffect } from "react";
import Footer from "../_components/footer";
import AOS from "aos";
import "aos/dist/aos.css";

const TermsPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Termos de Uso e Condições
            </h1>
            <p className="text-lg text-slate-300">
              Por favor, leia atentamente os termos e condições antes de usar
              nossos serviços.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-12">
            {/* Última Atualização */}
            <div className="text-center" data-aos="fade-up">
              <p className="text-sm text-slate-500">
                Última atualização: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Introdução */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                1. Introdução
              </h2>
              <p className="text-slate-600">
                Bem-vindo à CasaDeAnálises. Ao acessar e usar nossa plataforma,
                você concorda com estes termos de uso. Estes termos constituem
                um acordo legal entre você e a CasaDeAnálises, estabelecendo os
                direitos e obrigações relacionados ao uso de nossos serviços.
              </p>
            </div>

            {/* Serviços */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                2. Serviços
              </h2>
              <p className="mb-4 text-slate-600">
                A CasaDeAnálises oferece uma plataforma de análise de Fundos de
                Investimento Imobiliário (FIIs) que inclui:
              </p>
              <ul className="list-inside list-disc space-y-2 text-slate-600">
                <li>Análises detalhadas de FIIs</li>
                <li>Relatórios de mercado</li>
                <li>Ferramentas de acompanhamento de carteira</li>
                <li>Conteúdo educacional</li>
                <li>Alertas e notificações personalizadas</li>
              </ul>
            </div>

            {/* Responsabilidades do Usuário */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                3. Responsabilidades do Usuário
              </h2>
              <p className="mb-4 text-slate-600">
                Ao utilizar nossos serviços, você concorda em:
              </p>
              <ul className="list-inside list-disc space-y-2 text-slate-600">
                <li>Fornecer informações verdadeiras e precisas</li>
                <li>Manter a confidencialidade de sua conta</li>
                <li>Não compartilhar credenciais de acesso</li>
                <li>Utilizar o serviço de acordo com as leis aplicáveis</li>
                <li>Respeitar os direitos de propriedade intelectual</li>
              </ul>
            </div>

            {/* Assinaturas e Pagamentos */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                4. Assinaturas e Pagamentos
              </h2>
              <p className="mb-4 text-slate-600">
                Detalhes sobre nossos planos de assinatura:
              </p>
              <ul className="list-inside list-disc space-y-2 text-slate-600">
                <li>As assinaturas são cobradas de forma recorrente</li>
                <li>Cancelamentos podem ser feitos a qualquer momento</li>
                <li>Reembolsos seguem nossa política específica</li>
                <li>Alterações de preço serão notificadas com antecedência</li>
              </ul>
            </div>

            {/* Propriedade Intelectual */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                5. Propriedade Intelectual
              </h2>
              <p className="text-slate-600">
                Todo o conteúdo disponível na plataforma, incluindo mas não
                limitado a textos, gráficos, logotipos, ícones, imagens, clips
                de áudio, downloads digitais e compilações de dados, é
                propriedade da CasaDeAnálises ou de seus fornecedores de
                conteúdo e está protegido por leis internacionais de direitos
                autorais.
              </p>
            </div>

            {/* Limitação de Responsabilidade */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                6. Limitação de Responsabilidade
              </h2>
              <p className="text-slate-600">
                As análises e informações fornecidas pela CasaDeAnálises são
                apenas para fins informativos e educacionais. Não constituem
                recomendação de investimento. Todas as decisões de investimento
                são de responsabilidade exclusiva do usuário.
              </p>
            </div>

            {/* Modificações dos Termos */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                7. Modificações dos Termos
              </h2>
              <p className="text-slate-600">
                A CasaDeAnálises reserva-se o direito de modificar estes termos
                a qualquer momento. Os usuários serão notificados sobre
                alterações significativas e o uso continuado da plataforma após
                as alterações constitui aceitação dos novos termos.
              </p>
            </div>

            {/* Contato */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                8. Contato
              </h2>
              <p className="text-slate-600">
                Para questões relacionadas a estes termos de uso, entre em
                contato conosco através do email: suporte@casadeanalises.com.br
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsPage;
