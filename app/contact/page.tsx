"use client";

import { useEffect } from "react";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import { Button } from "../_components/ui/button";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  MessageCircleIcon,
  ClockIcon,
  SendIcon,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <MessageCircleIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Entre em Contato
            </h1>
            <p className="text-lg text-slate-300">
              Estamos aqui para ajudar! Entre em contato conosco para tirar suas
              dúvidas ou fazer sugestões.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-8" data-aos="fade-right">
                <div className="rounded-lg bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-slate-900">
                    Informações de Contato
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MailIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Email</p>
                        <p className="text-slate-600">
                          contato@casadeanalises.com.br
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <PhoneIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Telefone</p>
                        <p className="text-slate-600">(11) 99999-9999</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MapPinIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Endereço</p>
                        <p className="text-slate-600">
                          Av. Paulista, 1000 - Bela Vista
                          <br />
                          São Paulo - SP, 01310-100
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <ClockIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          Horário de Atendimento
                        </p>
                        <p className="text-slate-600">
                          Segunda a Sexta: 9h às 18h
                          <br />
                          Sábado: 9h às 13h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="rounded-lg bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-slate-900">
                    Redes Sociais
                  </h2>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
                    >
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
                    >
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
                    >
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
                    >
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div data-aos="fade-left">
                <div className="rounded-lg bg-white p-8 shadow-lg">
                  <h2 className="mb-6 text-2xl font-bold text-slate-900">
                    Envie sua Mensagem
                  </h2>
                  <form className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-slate-900"
                      >
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-slate-900"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-medium text-slate-900"
                      >
                        Assunto
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Assunto da mensagem"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium text-slate-900"
                      >
                        Mensagem
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        className="w-full rounded-lg border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Digite sua mensagem aqui..."
                      ></textarea>
                    </div>

                    <Button
                      className="w-full rounded-lg bg-primary py-6 text-white transition-all hover:bg-primary/90"
                      type="submit"
                    >
                      Enviar Mensagem
                      <SendIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div
              className="mt-12 overflow-hidden rounded-lg bg-white p-8 shadow-lg"
              data-aos="fade-up"
            >
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Nossa Localização
              </h2>
              <div className="aspect-video w-full rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.098815367482!2d-46.65390492374385!3d-23.564616178727447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1709234567890!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
