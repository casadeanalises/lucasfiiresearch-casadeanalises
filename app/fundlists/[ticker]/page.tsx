"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3Icon,
  LineChartIcon,
  PieChartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  BuildingIcon,
  DollarSignIcon,
  RefreshCwIcon,
  AlertCircle,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { fiiService } from "@/app/services/fiiService";
import {
  FIIDetails,
  PriceHistoryItem,
  DividendHistoryItem,
} from "@/app/types/FII";
import { Button } from "@/app/_components/ui/button";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
} from "@/app/utils/formatters";

// Tooltip personalizado para os preços
const CustomPriceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border border-gray-200 bg-white p-3 shadow-md">
        <p className="font-medium text-gray-900">{formatDate(label, "long")}</p>
        <p className="text-gray-800">
          <span className="font-semibold">Preço:</span>{" "}
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip personalizado para os dividendos
const CustomDividendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border border-gray-200 bg-white p-3 shadow-md">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-gray-800">
          <span className="font-semibold">Dividendo:</span>{" "}
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip personalizado para a composição
const CustomCompositionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border border-gray-200 bg-white p-3 shadow-md">
        <p className="font-medium text-gray-900">{payload[0].name}</p>
        <p className="text-gray-800">
          <span className="font-semibold">Valor:</span>{" "}
          {formatPercent(payload[0].value / 100)}
        </p>
      </div>
    );
  }
  return null;
};

export default function FundDetailPage({
  params,
}: {
  params: { ticker: string };
}) {
  const [fund, setFund] = useState<FIIDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("6 Meses");
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const periods = ["1 Mês", "3 Meses", "6 Meses", "1 Ano", "Máximo"];

  const fetchFundDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Buscando detalhes para o FII ${params.ticker}...`);
      const details = await fiiService.getFIIDetails(params.ticker);

      if (details) {
        setFund(details);
        console.log(`Detalhes do FII ${params.ticker} carregados com sucesso`);

        // Carregar histórico de preços para o período selecionado
        const history = await fiiService.getPriceHistoryByPeriod(
          params.ticker,
          selectedPeriod,
        );
        setPriceHistory(history);
      } else {
        console.error(`FII ${params.ticker} não encontrado`);
        setError(
          `Não foi possível encontrar o FII com o ticker ${params.ticker}`,
        );
      }
    } catch (err) {
      console.error("Erro ao carregar detalhes do FII:", err);
      setError(
        `Erro ao carregar detalhes do FII: ${(err as Error).message || "Desconhecido"}`,
      );
    } finally {
      setLoading(false);
      setLastUpdateTime(new Date());
    }
  }, [params.ticker, selectedPeriod]);

  // Função para atualizar os dados manualmente
  const refreshData = useCallback(async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      // Buscar dados atualizados
      const updatedDetails = await fiiService.getFIIDetails(params.ticker);
      if (updatedDetails) {
        setFund(updatedDetails);
        // Atualizar também o histórico de preços
        const history = await fiiService.getPriceHistoryByPeriod(
          params.ticker,
          selectedPeriod,
        );
        setPriceHistory(history);
        console.log("✅ Dados atualizados com sucesso");
      }
      setLastUpdateTime(new Date());
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
    } finally {
      setIsUpdating(false);
    }
  }, [params.ticker, selectedPeriod, isUpdating]);

  // Efeito para carregar detalhes do FII quando a página carregar
  useEffect(() => {
    // Garantir que utilizamos dados de backup para fins de demonstração
    if (!fiiService.useBackupData) {
      console.log(
        "Ativando modo de dados de backup para garantir visualização",
      );
      fiiService.useBackupData = true;
    }
    fetchFundDetails();
  }, [fetchFundDetails]);

  // Efeito para atualizar o histórico de preços quando o período muda
  useEffect(() => {
    if (fund) {
      fiiService
        .getPriceHistoryByPeriod(params.ticker, selectedPeriod)
        .then((history: PriceHistoryItem[]) => setPriceHistory(history));
    }
  }, [params.ticker, selectedPeriod, fund]);

  // Formatar horário da última atualização
  const formatUpdateTime = () => {
    if (!lastUpdateTime) return "Nunca";
    return lastUpdateTime.toLocaleTimeString("pt-BR");
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <div className="flex animate-pulse flex-col items-center">
          <div className="mb-4 h-8 w-40 rounded bg-gray-200"></div>
          <div className="h-4 w-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <div className="flex max-w-2xl items-start rounded-lg bg-red-50 p-4 text-red-800">
          <AlertCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Erro</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <div className="flex max-w-2xl items-start rounded-lg bg-yellow-50 p-4 text-yellow-800">
          <AlertCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">FII não encontrado</h3>
            <p>
              Não foi possível encontrar informações para o ticker{" "}
              {params.ticker}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Link
          href="/"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeftIcon className="mr-1 h-5 w-5" />
          <span>Voltar para a página inicial</span>
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/fundlists"
              className="mr-4 flex items-center text-gray-600 hover:text-blue-600"
            >
              <ChevronLeftIcon className="mr-1 h-5 w-5" />
              <span>Voltar para lista</span>
            </Link>
            <h1 className="text-3xl font-bold">{fund.ticker}</h1>
            <span className="ml-3 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800">
              {fund.category}
            </span>
          </div>
          <button
            onClick={refreshData}
            disabled={isUpdating}
            className="flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            <RefreshCwIcon
              className={`mr-1 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
            />
            <span>Atualizar</span>
          </button>
        </div>
        <h2 className="mt-1 text-xl font-medium text-gray-700">{fund.name}</h2>
        <p className="mt-2 text-gray-600">
          <span className="font-medium">Gestor:</span> {fund.manager}
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Preço Atual</p>
              <p className="mt-1 text-2xl font-bold">
                {formatCurrency(fund.price)}
              </p>
            </div>
            <div
              className={`flex items-center rounded-full p-2 ${
                fund.changePercent >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {fund.changePercent >= 0 ? (
                <TrendingUpIcon className="h-6 w-6" />
              ) : (
                <TrendingDownIcon className="h-6 w-6" />
              )}
            </div>
          </div>
          <div
            className={`mt-2 inline-flex items-center text-sm font-medium ${
              fund.changePercent >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {fund.changePercent >= 0 ? "+" : ""}
            {formatPercent(fund.changePercent / 100)}
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Dividend Yield
              </p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {formatPercent(fund.dividendYield / 100)}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-2 text-green-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Último dividendo: {formatCurrency(fund.dividend)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">P/VP</p>
              <p className="mt-1 text-2xl font-bold">{fund.pvp.toFixed(2)}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-2 text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Patrimônio Líquido: {formatCurrency(fund.patrimony)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Liquidez Diária
              </p>
              <p className="mt-1 text-2xl font-bold">
                {formatCurrency(fund.dailyLiquidity)}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-2 text-purple-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Última atualização: {formatUpdateTime()}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gráfico de Preços */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Histórico de Preços</h3>
            <div className="flex space-x-2">
              {periods.map((period) => (
                <button
                  key={period}
                  className={`rounded-md px-3 py-1 text-sm ${
                    selectedPeriod === period
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => formatDate(date, "short")}
                />
                <YAxis
                  domain={["dataMin - 1", "dataMax + 1"]}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip content={<CustomPriceTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Dividendos */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Histórico de Dividendos</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fund.dividendHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(date) => formatDate(date, "month")}
                />
                <YAxis tickFormatter={(value) => `R$${value}`} />
                <Tooltip content={<CustomDividendTooltip />} />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detalhes adicionais */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Informações Gerais */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Sobre o Fundo</h3>
          <p className="text-gray-700">{fund.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Valor da Cota
              </h4>
              <p className="text-gray-800">{formatCurrency(fund.price)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Patrimônio Líquido
              </h4>
              <p className="text-gray-800">
                {formatCurrency(fund.liquidPatrimony)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Valor de Mercado
              </h4>
              <p className="text-gray-800">
                {formatCurrency(fund.marketValue)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Último Dividendo
              </h4>
              <p className="text-gray-800">
                {formatCurrency(fund.lastDividend)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">P/VP</h4>
              <p className="text-gray-800">{fund.pvp.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Dividend Yield
              </h4>
              <p className="text-gray-800">
                {formatPercent(fund.dividendYield / 100)}
              </p>
            </div>
          </div>
        </div>

        {/* Composição */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Composição do Portfólio</h3>
          <div className="flex h-64 items-center justify-center">
            {fund.composition && fund.composition.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fund.composition}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="label"
                  >
                    {fund.composition.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.color ||
                          `#${Math.floor(Math.random() * 16777215).toString(16)}`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomCompositionTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                Dados de composição não disponíveis
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
