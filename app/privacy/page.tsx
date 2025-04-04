"use client";

import { useEffect } from "react";
import Footer from "../_components/footer";
import {
  ShieldIcon,
  LockIcon,
  EyeIcon,
  ServerIcon,
  BookOpenIcon,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const PrivacyPage = () => {
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
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <ShieldIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Política de Privacidade
            </h1>
            <p className="text-lg text-slate-300">
              Entenda como coletamos, usamos e protegemos suas informações
              pessoais
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
              <div className="mb-6 flex items-center">
                <BookOpenIcon className="mr-4 h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900">
                  1. Introdução
                </h2>
              </div>
              <p className="text-slate-600">
                A CasaDeAnálises está comprometida em proteger sua privacidade.
                Esta política descreve nossas práticas de coleta, uso e proteção
                de dados pessoais, em conformidade com a Lei Geral de Proteção
                de Dados (LGPD) e outras legislações aplicáveis.
              </p>
            </div>

            {/* Coleta de Dados */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <div className="mb-6 flex items-center">
                <EyeIcon className="mr-4 h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900">
                  2. Coleta de Dados
                </h2>
              </div>
              <p className="mb-4 text-slate-600">
                Coletamos as seguintes informações:
              </p>
              <ul className="list-inside list-disc space-y-3 text-slate-600">
                <li>Informações de cadastro (nome, email, telefone)</li>
                <li>Dados de perfil de investidor</li>
                <li>Histórico de uso da plataforma</li>
                <li>Informações de pagamento</li>
                <li>Dados de navegação e cookies</li>
              </ul>
            </div>

            {/* Uso das Informações */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <div className="mb-6 flex items-center">
                <ServerIcon className="mr-4 h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900">
                  3. Uso das Informações
                </h2>
              </div>
              <p className="mb-4 text-slate-600">
                Utilizamos suas informações para:
              </p>
              <ul className="list-inside list-disc space-y-3 text-slate-600">
                <li>Fornecer e personalizar nossos serviços</li>
                <li>Processar pagamentos e transações</li>
                <li>Enviar atualizações e comunicações relevantes</li>
                <li>Melhorar nossa plataforma e serviços</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </div>

            {/* Compartilhamento de Dados */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <div className="mb-6 flex items-center">
                <LockIcon className="mr-4 h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900">
                  4. Compartilhamento de Dados
                </h2>
              </div>
              <p className="mb-4 text-slate-600">
                Podemos compartilhar suas informações com:
              </p>
              <ul className="list-inside list-disc space-y-3 text-slate-600">
                <li>Provedores de serviços essenciais</li>
                <li>Parceiros de processamento de pagamento</li>
                <li>Autoridades reguladoras quando exigido por lei</li>
              </ul>
              <p className="mt-4 text-slate-600">
                Não vendemos ou alugamos suas informações pessoais a terceiros.
              </p>
            </div>

            {/* Segurança dos Dados */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <div className="mb-6 flex items-center">
                <ShieldIcon className="mr-4 h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900">
                  5. Segurança dos Dados
                </h2>
              </div>
              <p className="mb-4 text-slate-600">
                Implementamos medidas de segurança robustas, incluindo:
              </p>
              <ul className="list-inside list-disc space-y-3 text-slate-600">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e planos de recuperação</li>
                <li>Treinamento de segurança para funcionários</li>
              </ul>
            </div>

            {/* Seus Direitos */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                6. Seus Direitos
              </h2>
              <p className="mb-4 text-slate-600">
                De acordo com a LGPD, você tem direito a:
              </p>
              <ul className="list-inside list-disc space-y-3 text-slate-600">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou imprecisos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar seu consentimento</li>
                <li>Solicitar a portabilidade dos dados</li>
              </ul>
            </div>

            {/* Cookies e Tecnologias Similares */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                7. Cookies e Tecnologias Similares
              </h2>
              <p className="text-slate-600">
                Utilizamos cookies e tecnologias similares para melhorar sua
                experiência, analisar o tráfego e personalizar conteúdo. Você
                pode controlar o uso de cookies através das configurações do seu
                navegador.
              </p>
            </div>

            {/* Alterações na Política */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                8. Alterações na Política
              </h2>
              <p className="text-slate-600">
                Podemos atualizar esta política periodicamente. Alterações
                significativas serão comunicadas através de notificação na
                plataforma ou por email. O uso continuado dos serviços após as
                alterações constitui aceitação da política atualizada.
              </p>
            </div>

            {/* Contato */}
            <div
              className="rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                9. Contato
              </h2>
              <p className="text-slate-600">
                Para questões relacionadas à privacidade ou para exercer seus
                direitos, entre em contato com nosso Encarregado de Proteção de
                Dados (DPO) através do email: privacidade@casadeanalises.com.br
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
