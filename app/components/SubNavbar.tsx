"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { useAuth } from "@clerk/nextjs";


interface MenuItem {
  label: string;
  href: string;
  beta?: boolean;
  soon?: boolean;
}

const SubNavbar = () => {
  const { isSignedIn } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: Record<string, MenuItem[]> = {

    ...(isSignedIn && {
    Fundos: [
      { label: "Lista de Fundos", href: "/fundlists", beta: true },
      { label: "Comparador de Fundos", href: "#", soon: true },
      { label: "Radar de Fundos", href: "#", soon: true },
      { label: "Posições Vendidas", href: "#", soon: true },
    ],

    "Dados de Mercado": [
      { label: "Agenda da Semana", href: "#", soon: true },
      { label: "Boletim Focus", href: "#", soon: true },
      { label: "Selic", href: "#", soon: true },
      { label: "IPCA", href: "#", soon: true },
      { label: "IGP-M", href: "#", soon: true },
      { label: "Juros Futuros", href: "#", soon: true },
      { label: "Títulos Públicos", href: "#", soon: true },
      { label: "IFIX", href: "#", soon: true },
      { label: "Índices de Mercado", href: "#", soon: true },
      { label: "Dólar", href: "#", soon: true },
      { label: "Resultado Fiscal", href: "#", soon: true },
      {
        label: "Emissão primária CRI / CRA / Deb. Incentivada",
        href: "#",
        soon: true,
      },
    ],

    Research: [
      { label: "Relatório Semanal", href: "/reports", beta: true },
      { label: "Carteira Recomendada", href: "#", soon: true },
      { label: "Curso de Investimento", href: "#", soon: true },
      { label: "Fundos não recomendados", href: "#", soon: true },
      { label: "Ranking de Gestoras", href: "#", soon: true },
    ],

      "Minha Conta": [
        { label: "Minha Carteira", href: "/mywallet", beta: true },
        { label: "Gerenciar Plano", href: "/subscription" },
        { label: "Suporte", href: "/contact", soon: true },
        // TODO: not so important { label: "Sugerir Melhorias", href: "#", soon: true },
        // { label: "Reportar Bugs", href: "#", soon: true },
      ],
    }),
  };

  const handleMouseEnter = (menu: string) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileItemClick = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  return (
    <nav className="border-b border-gray-800 bg-[#111827]">
     
      <div className="mx-auto hidden max-w-7xl px-4 lg:block">
        <div className="flex justify-center space-x-8">
          {Object.entries(menuItems).map(([menu, items]) => (
            <div
              key={menu}
              className="group relative"
              onMouseEnter={() => handleMouseEnter(menu)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center px-3 py-3 text-sm font-medium text-gray-300 hover:text-white">
                {menu === "Minha Conta" && <User className="mr-2 h-4 w-4" />}
                {menu}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === menu && (
                <div className="absolute left-0 z-50 mt-0 w-64 rounded-md border border-gray-700 bg-[#1F2937] shadow-lg">
                  <div className="py-2">
                    {items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <div className="flex items-center justify-between">
                          {item.label}
                          <div className="flex items-center gap-1">
                            {item.beta && (
                              <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs text-white">
                                Beta
                              </span>
                            )}
                            {item.soon && (
                              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs text-white">
                                Em breve
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

     
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleMobileMenu}
            className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            <span>Categorias</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isMobileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="space-y-1 px-2 pb-3">
            {Object.entries(menuItems).map(([menu, items]) => (
              <div key={menu} className="relative">
                <button
                  onClick={() => handleMobileItemClick(menu)}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  <div className="flex items-center">
                    {menu === "Minha Conta" && <User className="mr-2 h-4 w-4" />}
                    {menu}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === menu ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeDropdown === menu && (
                  <div className="mt-1 rounded-md border border-gray-700 bg-[#1F2937]">
                    <div className="py-2">
                      {items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <div className="flex items-center justify-between">
                            {item.label}
                            <div className="flex items-center gap-1">
                              {item.beta && (
                                <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs text-white">
                                  Beta
                                </span>
                              )}
                              {item.soon && (
                                <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs text-white">
                                  Em breve
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default SubNavbar;
