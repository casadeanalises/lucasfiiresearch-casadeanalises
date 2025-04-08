"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, BarChart3, PieChart, Loader2 } from "lucide-react";
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
        if (!sectorMap[item.fii.setor]) {
          sectorMap[item.fii.setor] = { valor: 0, percentual: 0 };
        }
        sectorMap[item.fii.setor].valor += itemValue;
        sectorMap[item.fii.setor].percentual =
          (sectorMap[item.fii.setor].valor / totalValue) * 100;
      });

      // Converter para array
      const sectorsArray = Object.entries(sectorMap).map(([setor, data]) => ({
        setor,
        valor: data.valor,
        percentual: data.percentual,
      }));

      // Ordenar por valor (maior para menor)
      sectorsArray.sort((a, b) => b.valor - a.valor);

      setSectorAllocation(sectorsArray);

      // Atualizar dados do gráfico
      setChartData({
        series: sectorsArray.map((s) => s.percentual),
        labels: sectorsArray.map((s) => s.setor),
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
    },
    labels: chartData.labels,
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    colors: ["#3182CE", "#38A169", "#E53E3E", "#DD6B20", "#805AD5", "#D53F8C"],
    tooltip: {
      y: {
        formatter: (val: number) => {
          return `${val.toFixed(2)}%`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => `R$ ${calculateTotalValue().toFixed(2)}`,
            },
          },
        },
      },
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return `${val.toFixed(1)}%`;
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
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Minha Carteira de FIIs</h2>
        <div className="flex items-center gap-2">
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </div>
          )}
          <button
            onClick={() => setIsAddingFII(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            disabled={isAddingFII}
          >
            <PlusCircle className="h-4 w-4" />
            Adicionar FII
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Minha Carteira de FIIs
                </h3>
                <button
                  className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
                  onClick={() => setIsAddingFII(!isAddingFII)}
                >
                  <PlusCircle size={16} />
                  <span>Adicionar FII</span>
                </button>
              </div>

              {isAddingFII && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Código do FII
                      </label>
                      <select
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                      >
                        <option value="">Selecione</option>
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
                        min="1"
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                        value={quantity || ""}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Preço Médio
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                        value={averagePrice || ""}
                        onChange={(e) =>
                          setAveragePrice(parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Data da Compra
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      onClick={resetForm}
                    >
                      Cancelar
                    </button>
                    <button
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
                      onClick={addToPortfolio}
                      disabled={
                        !searchCode || quantity <= 0 || averagePrice <= 0
                      }
                    >
                      Adicionar à Carteira
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
              {/* Lista de FIIs */}
              <div className="max-h-[500px] overflow-y-auto p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Ativos</h4>
                    <div className="text-sm text-gray-500">
                      Total: {formatCurrency(calculateTotalValue())}
                    </div>
                  </div>
                  <div className="mb-2 text-sm text-gray-500">
                    Dividend Yield Médio:{" "}
                    {(calculatePortfolioDividendYield() * 100).toFixed(2)}%
                  </div>
                </div>

                {portfolio.length > 0 ? (
                  <div className="space-y-3">
                    {portfolio.map((item, index) => (
                      <div
                        key={`${item.fii.codigo}-${index}`}
                        className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">
                                {item.fii.codigo}
                              </span>
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                {item.fii.setor}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.fii.nome}
                            </div>
                          </div>
                          <button
                            className="p-1 text-gray-400 transition-colors hover:text-red-500"
                            onClick={() => removeFromPortfolio(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <div>
                            <div className="text-xs text-gray-500">
                              Quantidade
                            </div>
                            <div className="font-medium">{item.quantidade}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">
                              Preço Atual
                            </div>
                            <div className="font-medium">
                              {formatCurrency(item.fii.preco)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Total</div>
                            <div className="font-medium">
                              {formatCurrency(item.quantidade * item.fii.preco)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between text-xs">
                          <div>
                            <span className="text-gray-500">Preço Médio:</span>{" "}
                            {formatCurrency(item.precoMedio)}
                          </div>
                          <div>
                            <span className="text-gray-500">DY:</span>{" "}
                            <span className="text-green-600">
                              {(item.fii.dividendYield * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Data Compra:</span>{" "}
                            {new Date(item.dataCompra).toLocaleDateString(
                              "pt-BR",
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500">
                    Sua carteira está vazia. Adicione FIIs para começar.
                  </div>
                )}
              </div>

              {/* Gráfico de alocação */}
              <div className="border-t border-gray-200 p-4 lg:border-l lg:border-t-0">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-medium">Alocação por Setor</h4>
                  <div className="flex gap-1">
                    <button
                      className={`rounded p-1.5 ${chartView === "pie" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                      onClick={() => setChartView("pie")}
                      title="Gráfico de Pizza"
                    >
                      <PieChart size={16} />
                    </button>
                    <button
                      className={`rounded p-1.5 ${chartView === "bar" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                      onClick={() => setChartView("bar")}
                      title="Gráfico de Barras"
                    >
                      <BarChart3 size={16} />
                    </button>
                  </div>
                </div>

                {portfolio.length > 0 ? (
                  <>
                    <div className="h-[300px]">
                      {typeof window !== "undefined" && (
                        <Chart
                          options={chartOptions}
                          series={
                            chartView === "pie"
                              ? chartData.series
                              : [{ data: chartData.series }]
                          }
                          type={chartView}
                          height="100%"
                        />
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      {sectorAllocation.map((sector) => (
                        <div
                          key={sector.setor}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className="mr-2 h-3 w-3 rounded-full"
                              style={{
                                backgroundColor:
                                  chartData.labels.indexOf(sector.setor) < 6
                                    ? [
                                        "#3182CE",
                                        "#38A169",
                                        "#E53E3E",
                                        "#DD6B20",
                                        "#805AD5",
                                        "#D53F8C",
                                      ][chartData.labels.indexOf(sector.setor)]
                                    : "#CBD5E0",
                              }}
                            ></div>
                            <span className="text-sm">{sector.setor}</span>
                          </div>
                          <div className="text-sm">
                            <span className="mr-2 font-medium">
                              {formatCurrency(sector.valor)}
                            </span>
                            <span className="text-gray-500">
                              ({sector.percentual.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-gray-500">
                    Adicione FIIs para visualizar a alocação
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
