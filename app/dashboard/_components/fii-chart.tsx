"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Importar o componente de gráfico de forma dinâmica para evitar problemas com SSR
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

interface FIIHistoricData {
  codigo: string;
  datas: string[];
  precos: number[];
  dividendos: number[];
}

// Definir tipos para o estado do gráfico
interface ChartSeries {
  name: string;
  data: number[];
  type?: string;
}

interface ChartData {
  // Utilizamos Record para um tipo mais flexível que se adapta ao ApexCharts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>;
  series: ChartSeries[];
}

// Dados históricos simulados para alguns FIIs
const historicDataMock: Record<string, FIIHistoricData> = {
  HGLG11: {
    codigo: "HGLG11",
    datas: [
      "Jan/23",
      "Fev/23",
      "Mar/23",
      "Abr/23",
      "Mai/23",
      "Jun/23",
      "Jul/23",
      "Ago/23",
      "Set/23",
      "Out/23",
      "Nov/23",
      "Dez/23",
    ],
    precos: [
      165.24, 167.88, 169.45, 168.2, 170.35, 172.05, 174.3, 173.15, 175.6,
      177.2, 176.1, 172.05,
    ],
    dividendos: [
      1.15, 1.18, 1.2, 1.22, 1.24, 1.25, 1.25, 1.25, 1.27, 1.28, 1.3, 1.25,
    ],
  },
  KNRI11: {
    codigo: "KNRI11",
    datas: [
      "Jan/23",
      "Fev/23",
      "Mar/23",
      "Abr/23",
      "Mai/23",
      "Jun/23",
      "Jul/23",
      "Ago/23",
      "Set/23",
      "Out/23",
      "Nov/23",
      "Dez/23",
    ],
    precos: [
      128.35, 129.46, 131.2, 130.75, 129.85, 132.4, 134.6, 135.25, 133.8,
      134.95, 133.6, 132.4,
    ],
    dividendos: [
      0.8, 0.82, 0.83, 0.83, 0.84, 0.85, 0.85, 0.85, 0.84, 0.84, 0.85, 0.85,
    ],
  },
  MXRF11: {
    codigo: "MXRF11",
    datas: [
      "Jan/23",
      "Fev/23",
      "Mar/23",
      "Abr/23",
      "Mai/23",
      "Jun/23",
      "Jul/23",
      "Ago/23",
      "Set/23",
      "Out/23",
      "Nov/23",
      "Dez/23",
    ],
    precos: [
      9.85, 9.92, 10.05, 10.12, 10.18, 10.25, 10.32, 10.38, 10.45, 10.5, 10.42,
      10.25,
    ],
    dividendos: [
      0.1, 0.1, 0.11, 0.11, 0.11, 0.11, 0.11, 0.12, 0.12, 0.12, 0.11, 0.11,
    ],
  },
  XPLG11: {
    codigo: "XPLG11",
    datas: [
      "Jan/23",
      "Fev/23",
      "Mar/23",
      "Abr/23",
      "Mai/23",
      "Jun/23",
      "Jul/23",
      "Ago/23",
      "Set/23",
      "Out/23",
      "Nov/23",
      "Dez/23",
    ],
    precos: [
      96.4, 97.85, 98.6, 99.45, 100.2, 102.8, 103.65, 104.3, 103.85, 104.95,
      103.6, 102.8,
    ],
    dividendos: [
      0.75, 0.77, 0.78, 0.78, 0.8, 0.82, 0.82, 0.83, 0.82, 0.82, 0.82, 0.82,
    ],
  },
  HGBS11: {
    codigo: "HGBS11",
    datas: [
      "Jan/23",
      "Fev/23",
      "Mar/23",
      "Abr/23",
      "Mai/23",
      "Jun/23",
      "Jul/23",
      "Ago/23",
      "Set/23",
      "Out/23",
      "Nov/23",
      "Dez/23",
    ],
    precos: [
      195.6, 198.35, 200.45, 201.8, 203.45, 205.75, 206.9, 207.45, 206.8,
      207.35, 206.2, 205.75,
    ],
    dividendos: [
      1.45, 1.48, 1.5, 1.52, 1.52, 1.55, 1.55, 1.58, 1.57, 1.57, 1.56, 1.55,
    ],
  },
};

// Interface para as props do componente
interface FIIChartProps {
  fii?: FII;
  compareFiis?: FII[];
  chartType?: "price" | "dividend" | "performance" | "combined";
}

export default function FIIChart({
  fii,
  compareFiis = [],
  chartType = "price",
}: FIIChartProps) {
  const [mainFii, setMainFii] = useState<FII | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    options: {
      chart: {
        id: "fii-chart",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          },
        },
        animations: {
          enabled: true,
        },
      },
      colors: ["#3182CE", "#38A169", "#E53E3E", "#DD6B20", "#805AD5"],
      stroke: {
        curve: "smooth",
        width: 2,
      },
      markers: {
        size: 0,
        hover: {
          size: 5,
        },
      },
      xaxis: {
        categories: [],
        title: {
          text: "Período",
        },
      },
      yaxis: {
        title: {
          text: "Preço (R$)",
        },
        labels: {
          formatter: (value: number) => {
            return value.toFixed(2);
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => {
            return `R$ ${value.toFixed(2)}`;
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [],
  });

  // Função para atualizar os dados do gráfico
  const updateChartData = useCallback(
    (mainFii: FII, compareFiis: FII[], chartType: string) => {
      const allFiis = [mainFii, ...compareFiis].filter(
        (f) => f && historicDataMock[f.codigo],
      );
      const historicDataList = allFiis
        .map((f) => historicDataMock[f.codigo])
        .filter(Boolean);

      if (historicDataList.length === 0) return;

      const baseData = historicDataList[0];
      let series: ChartSeries[] = [];
      const options = { ...chartData.options };

      switch (chartType) {
        case "price":
          series = historicDataList.map((data) => ({
            name: data.codigo,
            data: data.precos,
          }));
          options.yaxis = {
            title: { text: "Preço (R$)" },
            labels: {
              formatter: (value: number) => `R$ ${value.toFixed(2)}`,
            },
          };
          options.tooltip = {
            y: {
              formatter: (value: number) => `R$ ${value.toFixed(2)}`,
            },
          };
          break;

        case "dividend":
          series = historicDataList.map((data) => ({
            name: data.codigo,
            data: data.dividendos,
          }));
          options.yaxis = {
            title: { text: "Dividendo (R$)" },
            labels: {
              formatter: (value: number) => `R$ ${value.toFixed(2)}`,
            },
          };
          options.tooltip = {
            y: {
              formatter: (value: number) => `R$ ${value.toFixed(2)}`,
            },
          };
          break;

        case "performance":
          // Calculando performance em % baseada no primeiro valor
          series = historicDataList.map((data) => {
            const basePrice = data.precos[0];
            const performanceData = data.precos.map(
              (price) => ((price - basePrice) / basePrice) * 100,
            );

            return {
              name: data.codigo,
              data: performanceData,
            };
          });
          options.yaxis = {
            title: { text: "Performance (%)" },
            labels: {
              formatter: (value: number) => `${value.toFixed(2)}%`,
            },
          };
          options.tooltip = {
            y: {
              formatter: (value: number) => `${value.toFixed(2)}%`,
            },
          };
          break;

        case "combined":
          // Mostrar preço e dividendo para o FII principal
          if (historicDataList[0]) {
            series = [
              {
                name: `${historicDataList[0].codigo} - Preço`,
                data: historicDataList[0].precos,
                type: "line",
              },
              {
                name: `${historicDataList[0].codigo} - Dividendo`,
                data: historicDataList[0].dividendos,
                type: "column",
              },
            ];
            options.yaxis = [
              {
                title: { text: "Preço (R$)" },
                labels: {
                  formatter: (value: number) => `R$ ${value.toFixed(2)}`,
                },
              },
              {
                opposite: true,
                title: { text: "Dividendo (R$)" },
                labels: {
                  formatter: (value: number) => `R$ ${value.toFixed(2)}`,
                },
              },
            ];
            options.tooltip = {
              y: {
                formatter: (value: number) => {
                  return `R$ ${value.toFixed(2)}`;
                },
              },
            };
          }
          break;
      }

      setChartData({
        options: {
          ...options,
          xaxis: {
            ...options.xaxis,
            categories: baseData.datas,
          },
        },
        series,
      });
    },
    [chartData.options],
  );

  // Efeito para atualizar o gráfico quando o FII principal muda
  useEffect(() => {
    if (fii) {
      setMainFii(fii);
      updateChartData(fii, compareFiis, chartType);
    }
  }, [fii, compareFiis, chartType, updateChartData]);

  // Renderizar placeholder se não tiver dados
  if (!mainFii) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-gray-400 shadow-sm">
        Selecione um FII acima para visualizar o gráfico
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {chartType === "price" && "Histórico de Preço"}
          {chartType === "dividend" && "Histórico de Dividendos"}
          {chartType === "performance" && "Performance Histórica"}
          {chartType === "combined" && "Preço & Dividendos"}
        </h3>
        <div className="flex gap-2">
          {mainFii && (
            <div className="flex items-center">
              <span className="mr-1 inline-block h-3 w-3 rounded-full bg-blue-600"></span>
              <span className="text-sm font-medium">{mainFii.codigo}</span>
            </div>
          )}
          {compareFiis.map((compareFii, index) => (
            <div key={compareFii.codigo} className="flex items-center">
              <span
                className={`mr-1 inline-block h-3 w-3 rounded-full ${
                  index === 0
                    ? "bg-green-600"
                    : index === 1
                      ? "bg-red-600"
                      : index === 2
                        ? "bg-orange-600"
                        : "bg-purple-600"
                }`}
              ></span>
              <span className="text-sm font-medium">{compareFii.codigo}</span>
            </div>
          ))}
        </div>
      </div>

      <div id="chart" className="w-full">
        {typeof window !== "undefined" && (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type={chartType === "combined" ? "line" : "area"}
            height={350}
          />
        )}
      </div>
    </div>
  );
}
