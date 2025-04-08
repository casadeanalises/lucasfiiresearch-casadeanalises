"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface FII {
  codigo: string;
  nome: string;
  setor: string;
  preco: number;
  valorPatrimonial: number;
  dividendYield: number;
  liquidezDiaria: number;
  valoracaoPVP: number;
  rentabilidadeMes: number;
  rentabilidadeAno: number;
  ultimoRendimento: number;
  dataUltimoInfoorme: string;
}

// Dados simulados de FIIs
const fiisMockData: FII[] = [
  {
    codigo: "HGLG11",
    nome: "CSHG Logística FII",
    setor: "Logística",
    preco: 172.05,
    valorPatrimonial: 165.89,
    dividendYield: 0.78,
    liquidezDiaria: 3456000,
    valoracaoPVP: 1.04,
    rentabilidadeMes: 2.34,
    rentabilidadeAno: 11.25,
    ultimoRendimento: 1.25,
    dataUltimoInfoorme: "15/06/2023",
  },
  {
    codigo: "KNRI11",
    nome: "Kinea Renda Imobiliária FII",
    setor: "Lajes Corporativas",
    preco: 132.4,
    valorPatrimonial: 139.76,
    dividendYield: 0.65,
    liquidezDiaria: 5123000,
    valoracaoPVP: 0.95,
    rentabilidadeMes: 1.85,
    rentabilidadeAno: 8.76,
    ultimoRendimento: 0.85,
    dataUltimoInfoorme: "10/06/2023",
  },
  {
    codigo: "MXRF11",
    nome: "Maxi Renda FII",
    setor: "Recebíveis",
    preco: 10.25,
    valorPatrimonial: 9.87,
    dividendYield: 1.12,
    liquidezDiaria: 8754000,
    valoracaoPVP: 1.04,
    rentabilidadeMes: 1.15,
    rentabilidadeAno: 12.45,
    ultimoRendimento: 0.11,
    dataUltimoInfoorme: "18/06/2023",
  },
  {
    codigo: "XPLG11",
    nome: "XP Log FII",
    setor: "Logística",
    preco: 102.8,
    valorPatrimonial: 111.23,
    dividendYield: 0.8,
    liquidezDiaria: 2875000,
    valoracaoPVP: 0.92,
    rentabilidadeMes: 3.25,
    rentabilidadeAno: 10.35,
    ultimoRendimento: 0.82,
    dataUltimoInfoorme: "20/06/2023",
  },
  {
    codigo: "HGBS11",
    nome: "CSHG Brasil Shopping FII",
    setor: "Shopping",
    preco: 205.75,
    valorPatrimonial: 210.86,
    dividendYield: 0.76,
    liquidezDiaria: 1985000,
    valoracaoPVP: 0.98,
    rentabilidadeMes: 2.15,
    rentabilidadeAno: 9.85,
    ultimoRendimento: 1.55,
    dataUltimoInfoorme: "12/06/2023",
  },
  {
    codigo: "VISC11",
    nome: "Vinci Shopping Centers FII",
    setor: "Shopping",
    preco: 112.35,
    valorPatrimonial: 115.68,
    dividendYield: 0.82,
    liquidezDiaria: 3254000,
    valoracaoPVP: 0.97,
    rentabilidadeMes: 1.95,
    rentabilidadeAno: 8.65,
    ultimoRendimento: 0.95,
    dataUltimoInfoorme: "16/06/2023",
  },
  {
    codigo: "XPML11",
    nome: "XP Malls FII",
    setor: "Shopping",
    preco: 95.2,
    valorPatrimonial: 99.45,
    dividendYield: 0.78,
    liquidezDiaria: 2654000,
    valoracaoPVP: 0.96,
    rentabilidadeMes: 2.35,
    rentabilidadeAno: 7.95,
    ultimoRendimento: 0.75,
    dataUltimoInfoorme: "14/06/2023",
  },
  {
    codigo: "RECR11",
    nome: "Rec Recebíveis Imobiliários FII",
    setor: "Recebíveis",
    preco: 96.4,
    valorPatrimonial: 96.85,
    dividendYield: 1.24,
    liquidezDiaria: 1856000,
    valoracaoPVP: 1.0,
    rentabilidadeMes: 1.65,
    rentabilidadeAno: 13.25,
    ultimoRendimento: 1.15,
    dataUltimoInfoorme: "19/06/2023",
  },
  {
    codigo: "BTLG11",
    nome: "BTG Pactual Logística FII",
    setor: "Logística",
    preco: 103.85,
    valorPatrimonial: 107.25,
    dividendYield: 0.82,
    liquidezDiaria: 1985000,
    valoracaoPVP: 0.97,
    rentabilidadeMes: 2.75,
    rentabilidadeAno: 9.35,
    ultimoRendimento: 0.85,
    dataUltimoInfoorme: "11/06/2023",
  },
  {
    codigo: "HGCR11",
    nome: "CSHG Recebíveis Imobiliários FII",
    setor: "Recebíveis",
    preco: 98.45,
    valorPatrimonial: 97.23,
    dividendYield: 1.15,
    liquidezDiaria: 2345000,
    valoracaoPVP: 1.01,
    rentabilidadeMes: 1.25,
    rentabilidadeAno: 12.85,
    ultimoRendimento: 1.1,
    dataUltimoInfoorme: "17/06/2023",
  },
];

interface FIISearchProps {
  onSelectFII?: (fii: FII) => void;
}

export default function FIISearch({ onSelectFII }: FIISearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<FII[]>([]);
  const [selectedFII, setSelectedFII] = useState<FII | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filteredFIIs = fiisMockData.filter(
        (fii) =>
          fii.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fii.nome.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setResults(filteredFIIs);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleSelectFII = (fii: FII) => {
    setSelectedFII(fii);
    setSearchTerm(fii.codigo);
    setShowResults(false);
    if (onSelectFII) onSelectFII(fii);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex w-full items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-200 bg-white p-3 pl-10 pr-20 focus:border-transparent focus:ring-2 focus:ring-blue-600"
              placeholder="Buscar FII por código ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length > 1 && setShowResults(true)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFII(null);
                  setShowResults(false);
                }}
              >
                <span className="text-gray-400 hover:text-gray-600">✕</span>
              </button>
            )}
          </div>
        </div>

        {showResults && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {results.length > 0 ? (
              <ul>
                {results.map((fii) => (
                  <li
                    key={fii.codigo}
                    className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-blue-50"
                    onClick={() => handleSelectFII(fii)}
                  >
                    <div>
                      <span className="font-bold">{fii.codigo}</span>
                      <span className="ml-2 text-gray-600">{fii.nome}</span>
                    </div>
                    <div>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-sm font-medium">
                        {fii.setor}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-gray-500">
                Nenhum FII encontrado
              </div>
            )}
          </div>
        )}
      </div>

      {selectedFII && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{selectedFII.codigo}</h3>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800">
                  {selectedFII.setor}
                </span>
              </div>
              <p className="text-gray-600">{selectedFII.nome}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {formatCurrency(selectedFII.preco)}
              </div>
              <div
                className={`text-sm font-medium ${selectedFII.rentabilidadeMes >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {selectedFII.rentabilidadeMes >= 0 ? "+" : ""}
                {formatPercent(selectedFII.rentabilidadeMes)} (mês)
              </div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-sm text-gray-500">Valor Patrimonial</div>
              <div className="font-bold">
                {formatCurrency(selectedFII.valorPatrimonial)}
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-sm text-gray-500">Dividend Yield</div>
              <div className="font-bold text-green-600">
                {formatPercent(selectedFII.dividendYield)}
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-sm text-gray-500">P/VP</div>
              <div className="font-bold">
                {selectedFII.valoracaoPVP.toFixed(2)}
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-sm text-gray-500">Último Dividendo</div>
              <div className="font-bold">
                {formatCurrency(selectedFII.ultimoRendimento)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Liquidez Diária:</span>{" "}
              {formatCurrency(selectedFII.liquidezDiaria)}
            </div>
            <div>
              <span className="font-medium">Rentabilidade no Ano:</span>
              <span
                className={
                  selectedFII.rentabilidadeAno >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {" "}
                {selectedFII.rentabilidadeAno >= 0 ? "+" : ""}
                {formatPercent(selectedFII.rentabilidadeAno)}
              </span>
            </div>
            <div>
              <span className="font-medium">Último Informe:</span>{" "}
              {selectedFII.dataUltimoInfoorme}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
