"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

// Definindo a interface para os itens de menu
interface MenuItem {
  label: string;
  href: string;
  beta?: boolean;
}

const SubNavbar = () => {
  const { isSignedIn } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: Record<string, MenuItem[]> = {
    Fundos: [
      { label: "Lista de Fundos", href: "/fundlists" },
      { label: "Comparador de Fundos", href: "#", beta: true },
      { label: "Radar de Fundos", href: "#", beta: true },
      { label: "Posições Vendidas", href: "#", beta: true },
    ],
    "Dados de Mercado": [
      { label: "Agenda da Semana", href: "#", beta: true },
      { label: "Boletim Focus", href: "#", beta: true },
      { label: "Selic", href: "#", beta: true },
      { label: "IPCA", href: "#", beta: true },
      { label: "IGP-M", href: "#", beta: true },
      { label: "Juros Futuros", href: "#", beta: true },
      { label: "Títulos Públicos", href: "#", beta: true },
      { label: "IFIX", href: "#", beta: true },
      { label: "Índices de Mercado", href: "#", beta: true },
      { label: "Dólar", href: "#", beta: true },
      { label: "Resultado Fiscal", href: "#", beta: true },
      {
        label: "Emissão primária CRI / CRA / Deb. Incentivada",
        href: "#",
        beta: true,
      },
    ],
    Research: [
      { label: "Relatório Semanal", href: "/reports" },
      { label: "Carteira Recomendada", href: "#", beta: true },
      { label: "Curso de Investimento", href: "#", beta: true },
      { label: "Fundos não recomendados", href: "#", beta: true },
      { label: "Ranking de Gestoras", href: "#", beta: true },
    ],
    Personalização: [
      { label: "Tema do Sistema", href: "#", beta: true },
      { label: "Página Inicial", href: "#", beta: true },
      { label: "Configurar Widgets", href: "#", beta: true },
      { label: "Layout de Dados", href: "#", beta: true },
    ],
    ...(isSignedIn && {
      "Minha Conta": [
        { label: "Minha Carteira", href: "/dashboard" },
        { label: "Sugerir Melhorias", href: "#", beta: true },
        { label: "Reportar Bugs", href: "#", beta: true },
        { label: "Central de Ajuda", href: "#", beta: true },
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
      {/* Desktop Menu */}
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
                          {item.beta && (
                            <span className="ml-2 rounded-md bg-indigo-600 px-2 py-0.5 text-xs text-white">
                              Beta
                            </span>
                          )}
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

      {/* Mobile Menu */}
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
                  {menu}
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
                            {item.beta && (
                              <span className="ml-2 rounded-md bg-indigo-600 px-2 py-0.5 text-xs text-white">
                                Beta
                              </span>
                            )}
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
