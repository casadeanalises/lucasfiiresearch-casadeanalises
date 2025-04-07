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
} from "lucide-react";
import {
  fiiService,
  FIIDetails,
  PriceHistoryItem,
  DividendHistoryItem,
} from "@/app/services/fiiService";
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
import { AlertCircle, ArrowDown, ArrowUp, Clock } from "lucide-react";
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
          {formatPercent(payload[0].value)}
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
    try {
      const details = await fiiService.getFIIDetails(params.ticker);
      if (details) {
        setFund(details);
        setError(null);
        // Carregar histórico de preços para o período selecionado
        const history = await fiiService.getPriceHistoryByPeriod(
          params.ticker,
          selectedPeriod,
        );
        setPriceHistory(history);
      } else {
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

  const refreshData = useCallback(async () => {
    if (isUpdating || !fund) return;

    setIsUpdating(true);
    try {
      // Simulação de atualização em tempo real
      const randomVariation = (Math.random() - 0.5) * 0.02; // Variação de até ±1%
      const newPrice = fund.price * (1 + randomVariation);
      const newChangePercent = fund.changePercent + (Math.random() - 0.4) * 0.5;

      setFund({
        ...fund,
        price: parseFloat(newPrice.toFixed(2)),
        changePercent: parseFloat(newChangePercent.toFixed(2)),
      });

      setLastUpdateTime(new Date());
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
    } finally {
      setIsUpdating(false);
    }
  }, [fund, isUpdating]);

  // Efeito para carregar detalhes do FII quando a página carregar
  useEffect(() => {
    fetchFundDetails();
  }, [fetchFundDetails]);

  // Efeito para atualizar a dados a cada 30 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [refreshData]);

  // Efeito para atualizar o histórico de preços quando o período muda
  useEffect(() => {
    if (fund) {
      fiiService
        .getPriceHistoryByPeriod(params.ticker, selectedPeriod)
        .then((history) => setPriceHistory(history));
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
    <div className="container mx-auto space-y-6 p-4">
      {/* Cabeçalho com informações básicas */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 md:text-3xl">
              {fund.ticker}
              <span className="text-lg font-normal text-gray-700">
                {fund.name}
              </span>
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <span>Categoria: {fund.category}</span>
              <span>•</span>
              <span>Gestor: {fund.manager}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(fund.price)}
              </div>
              <div
                className={`flex items-center ${fund.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {fund.changePercent >= 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4" />
                )}
                <span className="font-medium">
                  {formatPercent(Math.abs(fund.changePercent))}
                </span>
              </div>
            </div>

            <button
              onClick={refreshData}
              disabled={isUpdating}
              className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200 disabled:opacity-50"
              aria-label="Atualizar dados"
            >
              <RefreshCwIcon
                className={`h-5 w-5 ${isUpdating ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-600">
          <Clock className="mr-1 h-4 w-4" />
          <span>Última atualização: {formatUpdateTime()}</span>
        </div>
      </div>

      {/* Indicadores principais */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Dividend Yield</p>
          <p className="text-lg font-bold text-gray-800">
            {formatPercent(fund.dividendYield)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Último Dividendo</p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(fund.lastDividend)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Valor Patrimonial</p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(fund.assetValue)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">P/VP</p>
          <p className="text-lg font-bold text-gray-800">
            {fund.pvp.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Patrimônio Líquido</p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(fund.liquidPatrimony / 1000000)} mi
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Liquidez Diária</p>
          <p className="text-lg font-bold text-gray-800">
            {formatCurrency(fund.dailyLiquidity / 1000000)} mi
          </p>
        </div>
      </div>

      {/* Sobre o Fundo */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Sobre o Fundo
        </h2>
        <p className="text-gray-700">{fund.description}</p>
      </div>

      {/* Histórico de Cotações */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex flex-col justify-between sm:flex-row sm:items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Histórico de Cotações
          </h2>

          <div className="mt-2 flex flex-wrap gap-2 sm:mt-0">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-full px-3 py-1 text-sm ${
                  selectedPeriod === period
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={priceHistory}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => formatDate(date, "short")}
                tick={{ fontSize: 12, fill: "#1f2937" }}
                stroke="#6b7280"
              />
              <YAxis
                tickFormatter={(value) => `R$${value}`}
                tick={{ fontSize: 12, fill: "#1f2937" }}
                stroke="#6b7280"
                domain={["dataMin", "dataMax"]}
              />
              <Tooltip content={<CustomPriceTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                fill="#93c5fd"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid com histórico de dividendos e composição */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Histórico de Dividendos */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Histórico de Dividendos
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fund.dividendHistory}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#1f2937" }}
                  stroke="#6b7280"
                />
                <YAxis
                  tickFormatter={(value) => `R$${value}`}
                  tick={{ fontSize: 12, fill: "#1f2937" }}
                  stroke="#6b7280"
                />
                <Tooltip content={<CustomDividendTooltip />} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Composição do Fundo */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Composição do Fundo
          </h2>
          <div className="flex h-[300px] justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fund.composition}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="label"
                >
                  {fund.composition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomCompositionTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-gray-800">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Link de volta para a lista */}
      <Link
        href="/fundlists"
        className="inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        <ChevronLeftIcon className="mr-1 h-4 w-4" />
        Voltar para a lista de FIIs
      </Link>
    </div>
  );
}
