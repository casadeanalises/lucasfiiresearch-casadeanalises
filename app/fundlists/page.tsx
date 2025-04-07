"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  SearchIcon,
  BarChart3Icon,
  TrendingUpIcon,
  TrendingDownIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  XIcon,
  RefreshCwIcon,
  ChevronUp,
  ChevronDown,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { fiiService } from "@/app/services/fiiService";
import { FII } from "@/app/services/fiiService";
import { formatCurrency, formatPercent } from "@/app/utils/formatters";

// Tipos para ordenação
type SortOption = "ticker" | "price" | "dividend" | "dividendYield";
type SortDirection = "asc" | "desc";

export default function FundListsPage() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get("search") || "";

  const [funds, setFunds] = useState<FII[]>([]);
  const [filteredFunds, setFilteredFunds] = useState<FII[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortBy, setSortBy] = useState<SortOption>("ticker");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const categories = [
    "Todos",
    "Logística",
    "Shoppings",
    "Lajes Corporativas",
    "Híbrido",
    "Papel",
    "Residencial",
    "Recebíveis",
    "Fundos de Fundos",
  ];

  // Função para calcular quantidade total de páginas
  const totalPages = Math.ceil(filteredFunds.length / itemsPerPage);

  // Função para obter fundos da página atual
  const getCurrentPageFunds = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFunds.slice(startIndex, endIndex);
  };

  // Função para alterar a página
  const changePage = (pageNumber: number) => {
    // Garantir que a página esteja dentro dos limites
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;

    setCurrentPage(pageNumber);

    // Rolar para o topo quando mudar de página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Função para carregar os FIIs
  const fetchFunds = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fiiService.getAllFIIs();

      setFunds(data);

      // Se houver termo de busca inicial, aplicar o filtro automaticamente
      if (initialSearchTerm) {
        const term = initialSearchTerm.toLowerCase();
        const filtered = data.filter(
          (fund) =>
            fund.ticker.toLowerCase().includes(term) ||
            fund.name.toLowerCase().includes(term),
        );
        setFilteredFunds(filtered);
      } else {
        setFilteredFunds(data);
      }

      setLastUpdateTime(new Date());
    } catch (error) {
      console.error("Erro ao carregar os fundos:", error);
    } finally {
      setLoading(false);
    }
  }, [initialSearchTerm]);

  // Função para atualizar dados em tempo real
  const refreshData = useCallback(async () => {
    try {
      setIsUpdating(true);
      const updatedFunds = await fiiService.getRealTimeUpdates();

      setFunds(updatedFunds);

      // Re-aplicar os filtros atuais aos dados atualizados
      let filtered = [...updatedFunds];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (fund) =>
            fund.ticker.toLowerCase().includes(term) ||
            fund.name.toLowerCase().includes(term),
        );
      }

      if (selectedCategory && selectedCategory !== "Todos") {
        filtered = filtered.filter(
          (fund) => fund.category === selectedCategory,
        );
      }

      setFilteredFunds(filtered);
      setLastUpdateTime(new Date());
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [searchTerm, selectedCategory]);

  // Carregar os fundos na montagem do componente
  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  // Atualização automática a cada 1 minuto
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000); // 60 segundos

    return () => clearInterval(intervalId);
  }, [refreshData]);

  // Filtragem de fundos
  useEffect(() => {
    let result = [...funds];

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (fund) =>
          fund.ticker.toLowerCase().includes(term) ||
          fund.name.toLowerCase().includes(term),
      );
    }

    // Filtrar por categoria
    if (selectedCategory && selectedCategory !== "Todos") {
      result = result.filter((fund) => fund.category === selectedCategory);
    }

    setFilteredFunds(result);
  }, [funds, searchTerm, selectedCategory]);

  // Quando os filtros mudam, voltar para a primeira página
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const formatLastUpdate = () => {
    if (!lastUpdateTime) return "";
    return `${lastUpdateTime.toLocaleDateString()} às ${lastUpdateTime.toLocaleTimeString()}`;
  };

  // Obter categorias únicas para o filtro
  const uniqueCategories = useMemo(() => {
    const uniqueCategories = [...new Set(funds.map((fund) => fund.category))];
    return uniqueCategories.sort();
  }, [funds]);

  // Aplicar filtro e ordenação
  const filteredFundsSorted = useMemo(() => {
    return funds
      .filter((fund) => {
        const matchesSearch =
          searchTerm === "" ||
          fund.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fund.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "" || fund.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "ticker") {
          return sortDirection === "asc"
            ? a.ticker.localeCompare(b.ticker)
            : b.ticker.localeCompare(a.ticker);
        } else if (sortBy === "price") {
          return sortDirection === "asc"
            ? a.price - b.price
            : b.price - a.price;
        } else if (sortBy === "dividend") {
          return sortDirection === "asc"
            ? a.dividend - b.dividend
            : b.dividend - a.dividend;
        } else if (sortBy === "dividendYield") {
          return sortDirection === "asc"
            ? a.dividendYield - b.dividendYield
            : b.dividendYield - a.dividendYield;
        }
        return 0;
      });
  }, [funds, searchTerm, selectedCategory, sortBy, sortDirection]);

  // Paginação
  const paginatedFunds = filteredFundsSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Alternar direção da ordenação
  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection("asc");
    }
  };

  // Função para renderizar a seta de ordenação
  const renderSortArrow = (column: SortOption) => {
    if (sortBy !== column) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Cabeçalho */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col items-start">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Voltar para a página inicial</span>
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Lista de FIIs
            </h1>
            <p className="mt-1 text-gray-500">
              Encontre informações detalhadas sobre os principais fundos
              imobiliários do mercado
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Área de busca e filtros */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por ticker ou nome do fundo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-300 bg-white pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status de atualização */}
        <div className="mb-6 flex items-center justify-between rounded-lg bg-blue-50 p-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <RefreshCwIcon
              className={`h-4 w-4 ${isUpdating ? "animate-spin text-blue-600" : "text-gray-400"}`}
            />
            <span>
              {isUpdating
                ? "Atualizando dados..."
                : lastUpdateTime
                  ? `Última atualização: ${formatLastUpdate()}`
                  : "Dados carregados"}
            </span>
          </div>

          <Button
            onClick={refreshData}
            disabled={isUpdating}
            size="sm"
            variant="outline"
            className="border-gray-300 bg-white text-xs hover:bg-slate-50"
          >
            <RefreshCwIcon className="mr-1 h-3 w-3" />
            Atualizar agora
          </Button>
        </div>

        {/* Contador e estatísticas */}
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="mb-1 text-sm text-gray-500">
                Total de FIIs listados
              </h3>
              <p className="text-2xl font-bold text-gray-800">{funds.length}</p>
              <p className="mt-1 text-xs text-gray-500">
                Atualizado em tempo real
              </p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="mb-1 text-sm text-gray-500">FIIs encontrados</h3>
              <p className="text-2xl font-bold text-blue-600">
                {filteredFunds.length}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Com os filtros atuais
              </p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="mb-1 text-sm text-gray-500">
                Categoria mais comum
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {(() => {
                  const categories: Record<string, number> = {};
                  filteredFunds.forEach((fund) => {
                    categories[fund.category] =
                      (categories[fund.category] || 0) + 1;
                  });

                  let maxCategory = "";
                  let maxCount = 0;

                  Object.entries(categories).forEach(([category, count]) => {
                    if (count > maxCount) {
                      maxCount = count;
                      maxCategory = category;
                    }
                  });

                  return maxCategory || "N/A";
                })()}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Nos resultados atuais
              </p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="mb-1 text-sm text-gray-500">
                Dividend Yield médio
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {filteredFunds.length > 0
                  ? (
                      filteredFunds.reduce(
                        (sum, fund) => sum + fund.dividendYield,
                        0,
                      ) / filteredFunds.length
                    ).toFixed(2)
                  : 0}
                %
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Média dos FIIs filtrados
              </p>
            </div>
          </div>
        </div>

        {/* Tabela de FIIs */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <BarChart3Icon className="h-6 w-6 text-blue-600" />
            Resultados {filteredFunds.length > 0 && `(${filteredFunds.length})`}
          </h2>

          {filteredFunds.length > itemsPerPage && (
            <div className="text-sm text-gray-500">
              Exibindo página {currentPage} de {totalPages}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-2 text-gray-600">Carregando fundos...</span>
          </div>
        ) : filteredFunds.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <BarChart3Icon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Nenhum fundo encontrado
            </h3>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 hover:bg-gray-100"
                        onClick={() => handleSort("ticker")}
                      >
                        <div className="flex items-center">
                          <span>Ticker / Nome</span>
                          {renderSortArrow("ticker")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 hover:bg-gray-100"
                        onClick={() => handleSort("price")}
                      >
                        <div className="flex items-center">
                          <span>Preço</span>
                          {renderSortArrow("price")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 hover:bg-gray-100"
                        onClick={() => handleSort("dividend")}
                      >
                        <div className="flex items-center">
                          <span>Dividendo</span>
                          {renderSortArrow("dividend")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 hover:bg-gray-100"
                        onClick={() => handleSort("dividendYield")}
                      >
                        <div className="flex items-center">
                          <span>Yield</span>
                          {renderSortArrow("dividendYield")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                      >
                        Categoria
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedFunds.map((fund) => (
                      <tr key={fund.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link
                            href={`/fundlists/${fund.ticker}`}
                            className="block"
                          >
                            <div className="font-medium text-blue-600">
                              {fund.ticker}
                            </div>
                            <div className="max-w-[240px] truncate text-sm text-gray-700">
                              {fund.name}
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <div>{formatCurrency(fund.price)}</div>
                          <div
                            className={`flex items-center text-xs ${fund.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {fund.changePercent >= 0 ? (
                              <ArrowUp className="mr-1 h-3 w-3" />
                            ) : (
                              <ArrowDown className="mr-1 h-3 w-3" />
                            )}
                            <span>
                              {formatPercent(Math.abs(fund.changePercent))}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {formatCurrency(fund.dividend)}
                        </td>
                        <td className="px-6 py-4 font-medium text-green-600">
                          {formatPercent(fund.dividendYield)}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {fund.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginação */}
            {filteredFunds.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Voltar para a primeira página ao mudar itens por página
                    }}
                    className="rounded-md border border-gray-300 bg-white p-1.5 text-sm text-gray-700"
                  >
                    <option value={20}>20 por página</option>
                    <option value={50}>50 por página</option>
                    <option value={100}>100 por página</option>
                  </select>

                  <span className="text-sm text-gray-600">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredFunds.length)}
                    de {filteredFunds.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => changePage(1)}
                    disabled={currentPage === 1}
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 disabled:opacity-50"
                  >
                    &laquo;
                  </button>
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 disabled:opacity-50"
                  >
                    &lsaquo;
                  </button>

                  {/* Botões de página */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calcular quais números de página mostrar
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                        className={`rounded-md px-3 py-1 text-sm ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 disabled:opacity-50"
                  >
                    &rsaquo;
                  </button>
                  <button
                    onClick={() => changePage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 disabled:opacity-50"
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
