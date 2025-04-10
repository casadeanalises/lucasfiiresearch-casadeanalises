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
import { FII } from "@/app/types/FII";
import { formatCurrency, formatPercent } from "@/app/utils/formatters";
import { toast } from "react-hot-toast";
import Footer from "../_components/footer";

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
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [sortBy, setSortBy] = useState<SortOption>("ticker");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [totalFiis, setTotalFiis] = useState(0);
  const [avgDividendYield, setAvgDividendYield] = useState(0);
  const [mostCommonCategory, setMostCommonCategory] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

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
      console.log("Buscando FIIs...");
      const data = await fiiService.getAllFIIs();
      console.log(`FIIs carregados: ${data.length}`);

      if (data && data.length > 0) {
        setFunds(data);
        setFilteredFunds(data);
        setLastUpdateTime(new Date());
        setTotalFiis(data.length);

        // Calcula o dividend yield médio
        const totalDY = data.reduce(
          (sum, fii) => sum + (fii.dividendYield || 0),
          0,
        );
        setAvgDividendYield(totalDY / data.length);

        // Encontra a categoria mais comum
        if (data.length > 0) {
          const categoryCounts = data.reduce(
            (counts: Record<string, number>, fii) => {
              const category = fii.category || "Não categorizado";
              counts[category] = (counts[category] || 0) + 1;
              return counts;
            },
            {},
          );

          let maxCount = 0;
          let maxCategory = null;

          for (const [category, count] of Object.entries(categoryCounts)) {
            if (count > maxCount) {
              maxCount = count;
              maxCategory = category;
            }
          }

          setMostCommonCategory(maxCategory);
        }
      } else {
        console.error("Nenhum FII encontrado");
        setFunds([]);
        setFilteredFunds([]);
      }
    } catch (error) {
      console.error("Erro ao carregar os fundos:", error);
      setFunds([]);
      setFilteredFunds([]);
      setError("Falha ao carregar os dados. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para atualizar dados em tempo real
  const refreshData = useCallback(async () => {
    try {
      setIsUpdating(true);
      console.log("Atualizando dados...");
      const data = await fiiService.getAllFIIs();
      console.log(`Dados atualizados: ${data.length} FIIs`);

      if (data && data.length > 0) {
        setFunds(data);

        // Re-aplicar filtros atuais
        let filtered = [...data];
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
        setTotalFiis(data.length);

        // Calcula o dividend yield médio
        const totalDY = data.reduce(
          (sum, fii) => sum + (fii.dividendYield || 0),
          0,
        );
        setAvgDividendYield(totalDY / data.length);

        // Encontra a categoria mais comum
        if (data.length > 0) {
          const categoryCounts = data.reduce(
            (counts: Record<string, number>, fii) => {
              const category = fii.category || "Não categorizado";
              counts[category] = (counts[category] || 0) + 1;
              return counts;
            },
            {},
          );

          let maxCount = 0;
          let maxCategory = null;

          for (const [category, count] of Object.entries(categoryCounts)) {
            if (count > maxCount) {
              maxCount = count;
              maxCategory = category;
            }
          }

          setMostCommonCategory(maxCategory);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setError("Falha ao carregar os dados. Por favor, tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  }, [searchTerm, selectedCategory]);

  // Efeito para carregar os dados iniciais
  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  // Efeito para atualizar os dados a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Filtragem de fundos
  useEffect(() => {
    let result = [...funds];

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (fund: FII) =>
          fund.ticker.toLowerCase().includes(term) ||
          fund.name.toLowerCase().includes(term),
      );
    }

    // Filtrar por categoria
    if (selectedCategory && selectedCategory !== "Todos") {
      result = result.filter(
        (fund: FII) =>
          fund.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    setFilteredFunds(result);
    setCurrentPage(1); // Resetar para primeira página ao filtrar
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

  // Paginação
  const paginatedFunds = filteredFunds.slice(
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
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex-1">
        {/* Área de Busca e Filtros */}
        <div className="border-b border-gray-200 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              {/* Título e Estatísticas */}
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Lista de Fundos Imobiliários
                </h1>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-50 p-2">
                      <TrendingUpIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total de FIIs</p>
                      <p className="font-semibold text-gray-900">{totalFiis}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-50 p-2">
                      <BarChart3Icon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">DY Médio</p>
                      <p className="font-semibold text-gray-900">
                        {formatPercent(avgDividendYield)}
                      </p>
                    </div>
                  </div>
                  {mostCommonCategory && (
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-purple-50 p-2">
                        <FilterIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Categoria Principal
                        </p>
                        <p className="font-semibold text-gray-900">
                          {mostCommonCategory}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Busca e Filtros */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por código ou nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-gray-200 bg-white pl-10"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-white text-gray-700"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    disabled={isUpdating}
                    className="flex items-center gap-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCwIcon
                      className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
                    />
                    Atualizar
                  </Button>
                </div>
              </div>

              {/* Última Atualização */}
              {lastUpdateTime && (
                <p className="text-sm text-gray-500">
                  Última atualização: {formatLastUpdate()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Tabela de FIIs */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
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
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                        >
                          Gestor
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
                          <td className="px-6 py-4 text-gray-700">
                            {fund.manager || "Não disponível"}
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
                      <option value={50}>50 por página</option>
                      <option value={100}>100 por página</option>
                      <option value={200}>200 por página</option>
                      <option value={500}>500 por página</option>
                    </select>

                    <span className="text-sm text-gray-600">
                      Mostrando {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredFunds.length,
                      )}
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
      <Footer />
    </div>
  );
}
