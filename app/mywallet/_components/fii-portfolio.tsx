"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  BarChart3,
  PieChart,
  Loader2,
  TrendingUp,
  DollarSign,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import toast from "react-hot-toast";

// Importação dinâmica para evitar problemas com SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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
  proximoRendimento?: {
    data: string;
    valor: number;
  };
  proximoRelatorio?: {
    tipo: string;
    data: string;
  };
}

interface PortfolioItem {
  fii: FII;
  quantidade: number;
  precoMedio: number;
  dataCompra: string;
}

interface ChartData {
  series: number[];
  labels: string[];
}

interface SectorAllocation {
  setor: string;
  percentual: number;
  valor: number;
}

// Componente para gerenciar a carteira de FIIs
export default function FIIPortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [purchaseDate, setPurchaseDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [chartView, setChartView] = useState<"pie" | "bar">("pie");
  const [compositionChartView, setCompositionChartView] = useState<
    "pie" | "bar"
  >("bar");
  const [isAddingFII, setIsAddingFII] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sectorAllocation, setSectorAllocation] = useState<SectorAllocation[]>(
    [],
  );
  const [chartData, setChartData] = useState<ChartData>({
    series: [],
    labels: [],
  });

  // Mock data para disponibilizar alguns FIIs para adição
  const availableFIIs: FII[] = [
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
  ];

  // Carregar portfólio do usuário
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch("/api/portfolio");
        if (!response.ok) {
          throw new Error("Erro ao carregar portfólio");
        }
        const data = await response.json();
        setPortfolio(data.portfolio);
      } catch (error) {
        console.error("Erro ao carregar portfólio:", error);
        toast.error("Erro ao carregar seu portfólio");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Salvar portfólio quando houver alterações
  const savePortfolio = async (newPortfolio: PortfolioItem[]) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: newPortfolio }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar portfólio");
      }

      toast.success("Portfólio atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar portfólio:", error);
      toast.error("Erro ao salvar alterações no portfólio");
    } finally {
      setIsSaving(false);
    }
  };

  // Calcular a alocação por setor e atualizar o gráfico quando o portfólio mudar
  useEffect(() => {
    if (portfolio.length > 0) {
      const totalValue = portfolio.reduce(
        (sum, item) => sum + item.quantidade * item.fii.preco,
        0,
      );

      // Agrupar por setor
      const sectorMap: Record<string, { valor: number; percentual: number }> =
        {};

      portfolio.forEach((item) => {
        const itemValue = item.quantidade * item.fii.preco;
        const setor = item.fii.setor || "Outros";
        if (!sectorMap[setor]) {
          sectorMap[setor] = { valor: 0, percentual: 0 };
        }
        sectorMap[setor].valor += itemValue;
        sectorMap[setor].percentual =
          (sectorMap[setor].valor / totalValue) * 100;
      });

      // Converter para array e calcular valores
      const sectorsArray = Object.entries(sectorMap).map(([setor, data]) => ({
        setor,
        valor: data.valor,
        percentual: Number(data.percentual.toFixed(2)),
      }));

      // Ordenar por valor (maior para menor)
      sectorsArray.sort((a, b) => b.valor - a.valor);

      setSectorAllocation(sectorsArray);

      // Atualizar dados do gráfico
      setChartData({
        series: sectorsArray.map((s) => s.percentual),
        labels: sectorsArray.map(
          (s) => `${s.setor} (${formatCurrency(s.valor)})`,
        ),
      });
    } else {
      setChartData({
        series: [],
        labels: [],
      });
    }
  }, [portfolio]);

  // Adicionar FII ao portfólio
  const addToPortfolio = async () => {
    const selectedFII = availableFIIs.find((fii) => fii.codigo === searchCode);
    if (!selectedFII || quantity <= 0 || averagePrice <= 0) {
      toast.error("Por favor, preencha todos os campos corretamente");
      return;
    }

    const newPortfolio = [
      ...portfolio,
      {
        fii: selectedFII,
        quantidade: quantity,
        precoMedio: averagePrice,
        dataCompra: purchaseDate,
      },
    ];

    setPortfolio(newPortfolio);
    await savePortfolio(newPortfolio);
    resetForm();
    setIsAddingFII(false);
  };

  // Remover FII do portfólio
  const removeFromPortfolio = async (index: number) => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemIndex: index }),
      });

      if (!response.ok) {
        throw new Error("Erro ao remover item");
      }

      const newPortfolio = portfolio.filter((_, i) => i !== index);
      setPortfolio(newPortfolio);
      toast.success("Item removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover item:", error);
      toast.error("Erro ao remover item do portfólio");
    }
  };

  // Limpar formulário
  const resetForm = () => {
    setSearchCode("");
    setQuantity(0);
    setAveragePrice(0);
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setIsAddingFII(false);
  };

  // Calcular o total da carteira
  const calculateTotalValue = () => {
    return portfolio.reduce(
      (total, item) => total + item.quantidade * item.fii.preco,
      0,
    );
  };

  // Calcular o dividend yield ponderado da carteira
  const calculatePortfolioDividendYield = () => {
    if (portfolio.length === 0) return 0;

    const totalValue = calculateTotalValue();
    const weightedDividendYield = portfolio.reduce((sum, item) => {
      const itemValue = item.quantidade * item.fii.preco;
      const weight = itemValue / totalValue;
      return sum + item.fii.dividendYield * weight;
    }, 0);

    return weightedDividendYield;
  };

  // Opções do gráfico
  const chartOptions: ApexOptions = {
    chart: {
      type: chartView,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        dynamicAnimation: {
          enabled: true,
        },
      },
      fontFamily: "sans-serif",
      foreColor: "#4A5568",
    },
    labels: chartData.labels,
    xaxis: {
      categories: chartData.labels,
      labels: {
        show: true,
        rotate: -45,
        trim: true,
        style: {
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: "sans-serif",
          colors: "#1E293B",
        },
      },
      axisBorder: {
        show: true,
        color: "#CBD5E1",
      },
      axisTicks: {
        show: true,
        color: "#CBD5E1",
      },
    },
    yaxis: {
      labels: {
        formatter: (val: any) => {
          if (typeof val === "number") {
            return `${val.toFixed(1)}%`;
          }
          return "0%";
        },
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: "#1E293B",
        },
      },
      axisBorder: {
        show: true,
        color: "#CBD5E1",
      },
      axisTicks: {
        show: true,
        color: "#CBD5E1",
      },
    },
    grid: {
      show: true,
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
      position: "back",
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      fontWeight: 600,
      labels: {
        colors: "#1E293B",
      },
      markers: {
        size: 12,
        strokeWidth: 0,
        offsetX: 0,
        offsetY: 0,
      },
      itemMargin: {
        horizontal: 20,
        vertical: 8,
      },
    },
    colors: ["#3182CE", "#38A169", "#E53E3E", "#DD6B20", "#805AD5", "#D53F8C"],
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        if (!w.globals.labels[dataPointIndex]) return "";

        const label = w.globals.labels[dataPointIndex].split(" (")[0];
        const value = series[seriesIndex][dataPointIndex];
        const total = calculateTotalValue();
        const sectorValue = (value / 100) * total;

        return `
          <div style="
            background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%);
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.12);
            border: 2px solid rgba(59, 130, 246, 0.2);
            min-width: 220px;
            backdrop-filter: blur(8px);
          ">
            <div style="
              font-size: 18px;
              font-weight: 700;
              color: #1E40AF;
              margin-bottom: 12px;
              border-bottom: 2px solid rgba(59, 130, 246, 0.2);
              padding-bottom: 8px;
            ">
              ${label}
            </div>
            <div style="margin-top: 8px;">
              <div style="
                color: #2563EB;
                font-size: 16px;
                margin-bottom: 8px;
                font-weight: 600;
              ">
                <span style="color: #4B5563; font-weight: 500;">Alocação:</span> ${value.toFixed(2)}%
              </div>
              <div style="
                color: #059669;
                font-size: 16px;
                font-weight: 600;
              ">
                <span style="color: #4B5563; font-weight: 500;">Valor:</span> ${formatCurrency(sectorValue)}
              </div>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: "55%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "20px",
              fontFamily: "sans-serif",
              fontWeight: 700,
              color: "#FFFFFF",
              offsetY: -10,
              formatter: function (val: string) {
                return val.split(" (")[0];
              },
            },
            value: {
              show: true,
              fontSize: "26px",
              fontFamily: "sans-serif",
              fontWeight: 800,
              color: "#FFFFFF",
              offsetY: 5,
              formatter: function (val: any) {
                return `${Number(val).toFixed(2)}%`;
              },
            },
            total: {
              show: true,
              label: "Total da Carteira",
              color: "#1E293B",
              fontSize: "22px",
              fontWeight: 800,
              formatter: () => formatCurrency(calculateTotalValue()),
            },
          },
        },
      },
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          position: "top",
        },
        borderRadius: 8,
        barHeight: "70%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        if (!opts?.w?.globals?.labels?.[opts.dataPointIndex]) return "";

        const label = opts.w.globals.labels[opts.dataPointIndex].split(" (")[0];
        if (typeof val === "number") {
          return [`${label}`, `${val.toFixed(2)}%`].join("\n");
        }
        return "";
      },
      style: {
        fontSize: "16px",
        fontFamily: "sans-serif",
        fontWeight: 700,
        colors: ["#FFFFFF"],
      },
      background: {
        enabled: true,
        foreColor: "#FFFFFF",
        padding: 8,
        borderRadius: 6,
        borderWidth: 0,
        opacity: 0.9,
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 4,
          color: "#000000",
          opacity: 0.35,
        },
      },
    },
    stroke: {
      width: 2,
      colors: ["#FFFFFF"],
    },
    theme: {
      mode: "light",
      palette: "palette1",
      monochrome: {
        enabled: false,
        color: "#2563EB",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
        },
      },
    },
  };

  // Formatador de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Gráficos e Análises - Movido para o topo */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de Setores */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Distribuição por Setor
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartView("pie")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  chartView === "pie"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <PieChart className="h-4 w-4" />
                Pizza
              </button>
              <button
                onClick={() => setChartView("bar")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  chartView === "bar"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Barras
              </button>
            </div>
          </div>
          {portfolio.length > 0 && (
            <Chart
              options={{
                ...chartOptions,
                chart: {
                  ...chartOptions.chart,
                  type: chartView,
                  animations: {
                    enabled: true,
                    speed: 800,
                  },
                },
              }}
              series={
                chartView === "pie"
                  ? chartData.series
                  : [
                      {
                        name: "Alocação",
                        data: chartData.series,
                      },
                    ]
              }
              type={chartView}
              height={350}
            />
          )}
        </div>

        {/* Composição da Carteira */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Composição da Carteira
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompositionChartView("pie")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  compositionChartView === "pie"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <PieChart className="h-4 w-4" />
                Pizza
              </button>
              <button
                onClick={() => setCompositionChartView("bar")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  compositionChartView === "bar"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Barras
              </button>
            </div>
          </div>
          {portfolio.length > 0 && (
            <Chart
              options={{
                ...chartOptions,
                chart: {
                  ...chartOptions.chart,
                  type: compositionChartView,
                  animations: {
                    enabled: true,
                    speed: 800,
                  },
                  foreColor: "#1E293B",
                },
                labels: portfolio.map((item) => item.fii.codigo),
                plotOptions: {
                  pie: {
                    expandOnClick: true,
                    donut: {
                      size: "60%",
                      background: "transparent",
                      labels: {
                        show: true,
                        name: {
                          show: true,
                          fontSize: "20px",
                          fontFamily: "sans-serif",
                          fontWeight: 800,
                          color: "#FFFFFF",
                          offsetY: -10,
                        },
                        value: {
                          show: true,
                          fontSize: "24px",
                          fontFamily: "sans-serif",
                          fontWeight: 800,
                          color: "#FFFFFF",
                          offsetY: 5,
                          formatter: function (val: any) {
                            return typeof val === "number"
                              ? `${val.toFixed(2)}%`
                              : "0%";
                          },
                        },
                        total: {
                          show: true,
                          label: "Total da Carteira",
                          fontSize: "22px",
                          fontWeight: 800,
                          color: "#1E293B",
                        },
                      },
                    },
                  },
                  bar: {
                    horizontal: true,
                    distributed: true,
                    dataLabels: {
                      position: "top",
                    },
                    borderRadius: 8,
                    barHeight: "70%",
                  },
                },
                dataLabels: {
                  enabled: true,
                  formatter: function (val: any, opts: any) {
                    const label = portfolio[opts.dataPointIndex]?.fii.codigo;
                    if (!label || typeof val !== "number") return "";
                    return `${label}\n${val.toFixed(2)}%`;
                  },
                  style: {
                    fontSize: "16px",
                    fontFamily: "sans-serif",
                    fontWeight: 800,
                    colors: ["#FFFFFF"],
                  },
                  background: {
                    enabled: true,
                    foreColor: "#FFFFFF",
                    padding: 8,
                    borderRadius: 6,
                    borderWidth: 0,
                    opacity: 0.9,
                    dropShadow: {
                      enabled: true,
                      top: 2,
                      left: 2,
                      blur: 4,
                      color: "rgba(0,0,0,0.7)",
                      opacity: 0.6,
                    },
                  },
                  textAnchor: "middle",
                  distributed: true,
                },
                stroke: {
                  width: 2,
                  colors: ["#FFFFFF"],
                },
                tooltip: {
                  enabled: true,
                  shared: true,
                  intersect: false,
                  custom: function ({
                    series,
                    seriesIndex,
                    dataPointIndex,
                    w,
                  }) {
                    const fii = portfolio[dataPointIndex]?.fii;
                    if (!fii) return "";

                    const value =
                      portfolio[dataPointIndex].quantidade * fii.preco;
                    const total = calculateTotalValue();
                    const percentage = (value / total) * 100;

                    return `
                      <div style="
                        background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%);
                        padding: 16px;
                        border-radius: 12px;
                        box-shadow: 0 8px 16px rgba(0,0,0,0.12);
                        border: 2px solid rgba(59, 130, 246, 0.2);
                        min-width: 220px;
                      ">
                        <div style="
                          font-size: 18px;
                          font-weight: 700;
                          color: #1E293B;
                          margin-bottom: 12px;
                          border-bottom: 2px solid rgba(59, 130, 246, 0.2);
                          padding-bottom: 8px;
                        ">
                          ${fii.codigo}
                        </div>
                        <div style="margin-top: 8px;">
                          <div style="
                            color: #1E293B;
                            font-size: 16px;
                            margin-bottom: 8px;
                            font-weight: 600;
                          ">
                            <span style="color: #64748B;">Quantidade:</span> ${portfolio[dataPointIndex].quantidade} cotas
                          </div>
                          <div style="
                            color: #1E293B;
                            font-size: 16px;
                            margin-bottom: 8px;
                            font-weight: 600;
                          ">
                            <span style="color: #64748B;">Alocação:</span> ${percentage.toFixed(2)}%
                          </div>
                          <div style="
                            color: #1E293B;
                            font-size: 16px;
                            font-weight: 600;
                          ">
                            <span style="color: #64748B;">Valor:</span> ${formatCurrency(value)}
                          </div>
                        </div>
                      </div>
                    `;
                  },
                },
                colors: [
                  "#3B82F6",
                  "#10B981",
                  "#F97066",
                  "#F59E0B",
                  "#8B5CF6",
                  "#EC4899",
                  "#6366F1",
                  "#14B8A6",
                ],
              }}
              series={[
                {
                  name: "Valor Total",
                  data: portfolio.map((item) => {
                    const value = item.quantidade * item.fii.preco;
                    const total = calculateTotalValue();
                    return Number(((value / total) * 100).toFixed(2));
                  }),
                },
              ]}
              type={compositionChartView}
              height={350}
            />
          )}
        </div>
      </div>

      {/* Header com Resumo */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="group rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Valor Total</p>
              <h3 className="mt-1 text-2xl font-bold">
                {portfolio
                  .reduce(
                    (sum, item) => sum + item.quantidade * item.fii.preco,
                    0,
                  )
                  .toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200 transition-transform group-hover:rotate-12" />
          </div>
        </div>

        <div className="group rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-white shadow-lg transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">
                Rendimento Mensal
              </p>
              <h3 className="mt-1 text-2xl font-bold">
                {portfolio
                  .reduce(
                    (sum, item) =>
                      sum + item.quantidade * item.fii.ultimoRendimento,
                    0,
                  )
                  .toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200 transition-transform group-hover:rotate-12" />
          </div>
        </div>

        <div className="group rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-lg transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">
                Total de Ativos
              </p>
              <h3 className="mt-1 text-2xl font-bold">{portfolio.length}</h3>
            </div>
            <Building2 className="h-8 w-8 text-purple-200 transition-transform group-hover:rotate-12" />
          </div>
        </div>

        <div className="group rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white shadow-lg transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-100">
                Yield Médio (a.a.)
              </p>
              <h3 className="mt-1 text-2xl font-bold">
                {(calculatePortfolioDividendYield() * 100).toFixed(2)}%
              </h3>
            </div>
            <BarChart3 className="h-8 w-8 text-amber-200 transition-transform group-hover:rotate-12" />
          </div>
        </div>
      </div>

      {/* Botão Adicionar FII */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAddingFII(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
        >
          <PlusCircle className="h-5 w-5" />
          Adicionar Ativo
        </button>
      </div>

      {/* Próximos Eventos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {portfolio.map(
          (item) =>
            item.fii.proximoRendimento && (
              <div
                key={`${item.fii.codigo}-dividend`}
                className="rounded-xl bg-white p-4 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Próximo Rendimento
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {item.fii.codigo}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Data:{" "}
                      {new Date(
                        item.fii.proximoRendimento.data,
                      ).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      Valor:{" "}
                      {item.fii.proximoRendimento.valor.toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        },
                      )}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Próximo
                  </span>
                </div>
              </div>
            ),
        )}
      </div>

      {/* Lista de FIIs Atualizada */}
      <div className="rounded-xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Ativo
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Qtd.
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Preço Médio
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Preço Atual
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Variação
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Total
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Yield
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  P/VP
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Último Relatório
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {portfolio.map((item, index) => {
                const valorTotal = item.quantidade * item.fii.preco;
                const variacao =
                  ((item.fii.preco - item.precoMedio) / item.precoMedio) * 100;

                return (
                  <tr
                    key={item.fii.codigo}
                    className="group transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.fii.codigo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.fii.setor}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {item.quantidade}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {formatCurrency(item.precoMedio)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {formatCurrency(item.fii.preco)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div
                        className={`flex items-center gap-1 ${
                          variacao >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {variacao >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {Math.abs(variacao).toFixed(2)}%
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {formatCurrency(valorTotal)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {(item.fii.dividendYield * 100).toFixed(2)}%
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {item.fii.valoracaoPVP.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {new Date(item.fii.dataUltimoInfoorme).toLocaleDateString(
                        "pt-BR",
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => removeFromPortfolio(index)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Adição de FII */}
      {isAddingFII && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Adicionar FII</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Código do FII
                </label>
                <select
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Selecione um FII</option>
                  {availableFIIs.map((fii) => (
                    <option key={fii.codigo} value={fii.codigo}>
                      {fii.codigo} - {fii.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Preço Médio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={averagePrice}
                  onChange={(e) => setAveragePrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Data da Compra
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingFII(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={addToPortfolio}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado de Carregamento */}
      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
}
