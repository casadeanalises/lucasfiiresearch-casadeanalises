"use client";

import { useState, useEffect, useCallback } from "react";
import { ResponsiveLine } from "@nivo/line";

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
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
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
  const [chartData, setChartData] = useState<ChartSeries[]>([]);

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para formatar porcentagens
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Preparar dados do gráfico
  useEffect(() => {
    if (!fii) return;

    const historicData = historicDataMock[fii.codigo];
    if (!historicData) return;

    const series: ChartSeries[] = [];

    // Adicionar série principal
    if (chartType === "price" || chartType === "combined") {
      series.push({
        id: `${fii.codigo} - Preço`,
        data: historicData.datas.map((date, index) => ({
          x: date,
          y: historicData.precos[index],
        })),
      });
    }

    if (chartType === "dividend" || chartType === "combined") {
      series.push({
        id: `${fii.codigo} - Dividendos`,
        data: historicData.datas.map((date, index) => ({
          x: date,
          y: historicData.dividendos[index],
        })),
      });
    }

    // Adicionar FIIs para comparação
    compareFiis.forEach((compareFii) => {
      const compareData = historicDataMock[compareFii.codigo];
      if (!compareData) return;

      if (chartType === "price" || chartType === "combined") {
        series.push({
          id: `${compareFii.codigo} - Preço`,
          data: compareData.datas.map((date, index) => ({
            x: date,
            y: compareData.precos[index],
          })),
        });
      }

      if (chartType === "dividend" || chartType === "combined") {
        series.push({
          id: `${compareFii.codigo} - Dividendos`,
          data: compareData.datas.map((date, index) => ({
            x: date,
            y: compareData.dividendos[index],
          })),
        });
      }
    });

    setChartData(series);
    setMainFii(fii);
  }, [fii, compareFiis, chartType]);

  if (!mainFii || chartData.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveLine
        data={chartData}
        margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Período",
          legendOffset: 45,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: chartType === "dividend" ? "Dividendos (R$)" : "Preço (R$)",
          legendOffset: -50,
          legendPosition: "middle",
          format: (value: number) =>
            chartType === "dividend"
              ? formatCurrency(value)
              : formatCurrency(value),
        }}
        colors={{ scheme: "category10" }}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
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
    </div>
  );
}
