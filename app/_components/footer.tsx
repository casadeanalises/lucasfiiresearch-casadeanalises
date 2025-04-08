"use client";

import Image from "next/image";
import Link from "next/link";
import {
  YoutubeIcon,
  MessageCircleIcon,
  // InstagramIcon,
  // LinkedinIcon,
  // GithubIcon,
  // PhoneIcon,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center">
            <Image src="/logo.png" width={64} height={64} alt="Lucas FII" />
          </div>

          <div className="flex gap-4">
            <Link
              href="https://www.youtube.com/channel/UClmrZELCfAbZNzpl6rAT0gw"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-primary"
              target="_blank"
            >
              <YoutubeIcon size={20} />
            </Link>

            <Link
              href="https://t.me/lucasfiis"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-primary"
              target="_blank"
            >
              <MessageCircleIcon size={20} />
            </Link>

            {/* <Link
              href="instagram.com/lucasfiis"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-primary"
              target="_blank"
            >
              <InstagramIcon size={20} />
            </Link> */}

            {/* <Link
              href="#"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-primary"
            >
              <PhoneIcon size={20} />
            </Link>

            <Link
              href="#"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-primary"
            >
              <LinkedinIcon size={20} />
            </Link>

            <Link
              href="#"
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-primary"
            >
              <GithubIcon size={20} />
            </Link> */}
          </div>

          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-sm text-slate-500 hover:text-primary"
            >
              Termos
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-slate-500 hover:text-primary"
            >
              Privacidade
            </Link>
            <Link
              href="/contact"
              className="text-sm text-slate-500 hover:text-primary"
            >
              Contato
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row">
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Lucas FII Research L&L Consultoria
              Financeira, CNPJ: 99.999.999/9999-99
            </p>
            <p className="text-xs text-slate-400">site v1.0.0</p>
          </div>

          <span className="text-xs text-slate-400">
            Desenvolvido por{" "}
            <a
              href="https://devrocha.com.br"
              className="text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              DevRocha
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
