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
  Pencil,
} from "lucide-react";
import { ResponsivePie } from "@nivo/pie";
import toast from "react-hot-toast";

// Cores para os gráficos
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F97066",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#EF4444",
  "#8B5CF6",
  "#F472B6",
  "#22D3EE",
  "#FB923C",
  "#A3E635",
  "#2DD4BF",
];

// Função utilitária para formatação de moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

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

// Componente do gráfico usando Nivo
const DonutChart = ({ data }: { data: ChartData }) => {
  // Garantir que temos dados válidos
  const chartData = data.series
    .map((value, index) => ({
      id: data.labels[index] || "N/A",
      label: data.labels[index] || "N/A",
      value: value || 0,
    }))
    .filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-gray-500">Nenhum dado disponível</p>
      </div>
    );
  }

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative h-[400px] w-full">
      <ResponsivePie
        data={chartData}
        margin={{ top: 20, right: 140, bottom: 20, left: 20 }}
        innerRadius={0.6}
        padAngle={0.5}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={COLORS}
        borderWidth={2}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="white"
        enableArcLabels={true}
        arcLabel={(d) => `${((d.value / totalValue) * 100).toFixed(1)}%`}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 6,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#333",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
        theme={{
          tooltip: {
            container: {
              background: "#ffffff",
              fontSize: "14px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              padding: "12px",
            },
          },
        }}
      />
      {/* Total no centro do donut */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-sm font-medium text-gray-600">Total</p>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(totalValue)}
        </p>
      </div>
    </div>
  );
};

// Componente para gerenciar a carteira de FIIs
export default function FIIPortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [chartView, setChartView] = useState<"pie" | "bar">("pie");
  const [compositionChartView, setCompositionChartView] = useState<
    "pie" | "bar"
  >("bar");
  const [isAddingFII, setIsAddingFII] = useState(false);
  const [isEditingFII, setIsEditingFII] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sectorAllocation, setSectorAllocation] = useState<SectorAllocation[]>(
    [],
  );
  const [chartData, setChartData] = useState<ChartData>({
    series: [100],
    labels: ["Carregando..."],
  });
  const [availableFIIs, setAvailableFIIs] = useState<FII[]>([]);
  const [isLoadingFIIs, setIsLoadingFIIs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar lista de FIIs disponíveis
  useEffect(() => {
    const fetchAvailableFIIs = async () => {
      setIsLoadingFIIs(true);
      try {
        const response = await fetch("/api/fiis");
        if (!response.ok) {
          throw new Error("Erro ao carregar lista de FIIs");
        }
        const data = await response.json();
        setAvailableFIIs(data.fiis);
      } catch (error) {
        console.error("Erro ao carregar FIIs:", error);
        toast.error("Erro ao carregar lista de FIIs disponíveis");
        // Carregando dados mockados como fallback
        setAvailableFIIs([
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
        ]);
      } finally {
        setIsLoadingFIIs(false);
      }
    };

    fetchAvailableFIIs();
  }, []);

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

  // Calcular a alocação por setor
  useEffect(() => {
    try {
      if (!Array.isArray(portfolio) || portfolio.length === 0) {
        setChartData({
          series: [100],
          labels: ["Sem dados"],
        });
        return;
      }

      const validPortfolio = portfolio.filter(
        (item) => item?.fii?.preco && item?.quantidade && item?.fii?.setor,
      );

      if (validPortfolio.length === 0) {
        setChartData({
          series: [100],
          labels: ["Sem dados válidos"],
        });
        return;
      }

      const totalValue = validPortfolio.reduce(
        (sum, item) => sum + item.quantidade * item.fii.preco,
        0,
      );

      if (totalValue <= 0) {
        setChartData({
          series: [100],
          labels: ["Valor total inválido"],
        });
        return;
      }

      // Calcular alocação por setor
      const sectors = validPortfolio.reduce(
        (acc, item) => {
          const setor = item.fii.setor;
          const valor = item.quantidade * item.fii.preco;
          acc[setor] = (acc[setor] || 0) + valor;
          return acc;
        },
        {} as Record<string, number>,
      );

      const processedData = Object.entries(sectors)
        .map(([setor, valor]) => ({
          setor,
          valor,
          percentual: (valor / totalValue) * 100,
        }))
        .filter((item) => item.percentual > 0)
        .sort((a, b) => b.valor - a.valor);

      if (processedData.length === 0) {
        setChartData({
          series: [100],
          labels: ["Sem alocação"],
        });
        return;
      }

      setChartData({
        series: processedData.map((s) => Number(s.percentual.toFixed(2))),
        labels: processedData.map(
          (s) => `${s.setor} (${formatCurrency(s.valor)})`,
        ),
      });
    } catch (error) {
      console.error("Erro ao calcular alocação:", error);
      setChartData({
        series: [100],
        labels: ["Erro ao processar dados"],
      });
    }
  }, [portfolio]);

  // Filtrar FIIs com base no termo de busca
  const filteredFIIs = availableFIIs.filter((fii) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      fii.codigo.toLowerCase().includes(searchTermLower) ||
      fii.nome.toLowerCase().includes(searchTermLower) ||
      fii.setor.toLowerCase().includes(searchTermLower)
    );
  });

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
    setQuantity(0);
    setAveragePrice(0);
    setPurchaseDate("");
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

  // Função para iniciar edição
  const startEditing = (index: number) => {
    const item = portfolio[index];
    setSearchCode(item.fii.codigo);
    setQuantity(item.quantidade);
    setAveragePrice(item.precoMedio);
    setPurchaseDate(item.dataCompra);
    setEditingIndex(index);
    setIsEditingFII(true);
  };

  // Função para salvar edição
  const saveEdit = async () => {
    if (editingIndex === -1) return;
    setIsSaving(true);

    try {
      const updatedPortfolio = [...portfolio];
      updatedPortfolio[editingIndex] = {
        ...updatedPortfolio[editingIndex],
        quantidade: quantity,
        precoMedio: averagePrice,
        dataCompra: purchaseDate,
      };

      // Fazer requisição PUT para o MongoDB
      const response = await fetch("/api/portfolio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index: editingIndex,
          item: updatedPortfolio[editingIndex],
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar o item");
      }

      setPortfolio(updatedPortfolio);
      toast.success("Item atualizado com sucesso!");
      setIsEditingFII(false);
      setEditingIndex(-1);
      resetForm();
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      toast.error("Erro ao atualizar o item");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = (index: number) => {
    const newPortfolio = portfolio.filter((_, i) => i !== index);
    setPortfolio(newPortfolio);
    savePortfolio(newPortfolio);
    toast.success("Ativo removido com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de Setores */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Distribuição por Setor
            </h3>
          </div>
          {!isLoading ? (
            <DonutChart data={chartData} />
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-gray-500">Carregando...</p>
            </div>
          )}
        </div>

        {/* Gráfico de Alocação por Ativo */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Alocação por Ativo
            </h3>
          </div>
          {!isLoading ? (
            <div className="relative h-[400px] w-full">
              <ResponsivePie
                data={portfolio.map((item) => ({
                  id: item.fii.codigo,
                  label: `${item.fii.codigo} (${formatCurrency(item.quantidade * item.fii.preco)})`,
                  value: item.quantidade * item.fii.preco,
                }))}
                margin={{ top: 20, right: 140, bottom: 20, left: 20 }}
                innerRadius={0.6}
                padAngle={0.5}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={COLORS}
                borderWidth={2}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="white"
                enableArcLabels={true}
                arcLabel={(d) =>
                  `${((d.value / portfolio.reduce((sum, item) => sum + item.quantidade * item.fii.preco, 0)) * 100).toFixed(1)}%`
                }
                legends={[
                  {
                    anchor: "right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 6,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#333",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 12,
                    symbolShape: "circle",
                  },
                ]}
                theme={{
                  tooltip: {
                    container: {
                      background: "#ffffff",
                      fontSize: "14px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    },
                  },
                }}
              />
              {/* Total no centro do donut */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    portfolio.reduce(
                      (sum, item) => sum + item.quantidade * item.fii.preco,
                      0,
                    ),
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-gray-500">Carregando...</p>
            </div>
          )}
        </div>
      </div>

      {/* Composição da Carteira */}
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditing(index)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(index)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
                {isLoadingFIIs ? (
                  <div className="flex items-center justify-center py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">
                      Carregando FIIs...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="mb-2">
                      <input
                        type="text"
                        placeholder="Buscar FII por código, nome ou setor"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-300">
                      {filteredFIIs.length === 0 ? (
                        <div className="flex items-center justify-center p-4 text-gray-500">
                          Nenhum FII encontrado com esse termo
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {filteredFIIs.map((fii) => (
                            <div
                              key={fii.codigo}
                              className={`cursor-pointer p-3 hover:bg-gray-50 ${
                                searchCode === fii.codigo ? "bg-blue-50" : ""
                              }`}
                              onClick={() => setSearchCode(fii.codigo)}
                            >
                              <div className="flex justify-between">
                                <div>
                                  <span className="font-medium">
                                    {fii.codigo}
                                  </span>
                                  <p className="text-sm text-gray-600">
                                    {fii.nome}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {fii.preco.toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    })}
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    Div. Yield:{" "}
                                    {(fii.dividendYield * 100).toFixed(2)}%
                                  </p>
                                </div>
                              </div>
                              <div className="mt-1 flex justify-between text-xs">
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
                                  {fii.setor}
                                </span>
                                <span className="text-gray-500">
                                  P/VP: {fii.valoracaoPVP.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className={`${!searchCode ? "opacity-50" : ""}`}>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={!searchCode}
                />
              </div>

              <div className={`${!searchCode ? "opacity-50" : ""}`}>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Preço Médio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={averagePrice}
                  onChange={(e) => setAveragePrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={!searchCode}
                />
              </div>

              <div className={`${!searchCode ? "opacity-50" : ""}`}>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Data da Compra
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={!searchCode}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddingFII(false);
                    setSearchCode("");
                    setSearchTerm("");
                    resetForm();
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={addToPortfolio}
                  disabled={isLoadingFIIs || isSaving || !searchCode}
                  className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                    isLoadingFIIs || isSaving || !searchCode
                      ? "cursor-not-allowed bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adicionando...
                    </span>
                  ) : (
                    "Adicionar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de FII */}
      {isEditingFII && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Editar FII</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Código do FII
                </label>
                <p className="mt-1 text-gray-600">
                  {portfolio[editingIndex]?.fii.codigo}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço Médio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={averagePrice}
                  onChange={(e) => setAveragePrice(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data da Compra
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditingFII(false);
                  setEditingIndex(-1);
                  resetForm();
                }}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Salvar
              </button>
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
