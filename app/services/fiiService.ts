import axios from "axios";

// Interfaces
export interface FII {
  id: string;
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  dividend: number;
  dividendYield: number;
  patrimony: number;
  pvp: number;
  category: string;
  logoUrl?: string;
  lastUpdate?: string; // Timestamp da última atualização
}

export interface DividendHistoryItem {
  month: string;
  value: number;
}

export interface PriceHistoryItem {
  date: string;
  price: number;
}

export interface CompositionItem {
  label: string;
  value: number;
  color: string;
}

export interface FIIDetails extends FII {
  assetValue: number;
  lastDividend: number;
  liquidPatrimony: number;
  dailyLiquidity: number;
  marketValue: number;
  description: string;
  manager: string;
  dividendHistory: DividendHistoryItem[];
  priceHistory: PriceHistoryItem[];
  composition: CompositionItem[];
}

// Gerar dados de histórico de preços realistas
const generatePriceHistory = (
  basePrice: number,
  months: number = 12,
): PriceHistoryItem[] => {
  const today = new Date();
  const result: PriceHistoryItem[] = [];
  let currentPrice = basePrice;

  // Gerar preços para os últimos X meses com tendência e alguma volatilidade
  for (let i = months; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);

    // Adicionar tendência e volatilidade
    const trend = Math.sin(i / 2) * 0.1; // -10% a +10% tendência
    const volatility = (Math.random() - 0.5) * 0.05; // -2.5% a +2.5% volatilidade

    currentPrice = currentPrice * (1 + trend + volatility);
    currentPrice = Math.max(currentPrice, basePrice * 0.7); // Impedir quedas extremas

    // Para cada mês, adicionar várias entradas (um ponto a cada ~3 dias)
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    for (let day = 1; day <= daysInMonth; day += 3) {
      const dailyVolatility = (Math.random() - 0.5) * 0.02; // -1% a +1%
      const dailyPrice = currentPrice * (1 + dailyVolatility);

      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      result.push({
        date: formattedDate,
        price: parseFloat(dailyPrice.toFixed(2)),
      });
    }
  }

  return result;
};

// Gerar dados de dividendos realistas
const generateDividendHistory = (
  baseYield: number,
  basePrice: number,
): DividendHistoryItem[] => {
  const today = new Date();
  const result: DividendHistoryItem[] = [];

  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  // Gerar dividendos para os últimos 12 meses
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);

    // Calcular dividendo com alguma variação
    const yieldVariation = Math.random() * 0.2 - 0.1; // -10% a +10% de variação
    const monthlyYield = (baseYield / 12) * (1 + yieldVariation);
    const dividend = (basePrice * monthlyYield) / 100;

    const monthYear = `${monthNames[date.getMonth()]}/${date.getFullYear()}`;
    result.push({
      month: monthYear,
      value: parseFloat(dividend.toFixed(2)),
    });
  }

  return result;
};

// Gerar composição do fundo com base na categoria
const generateComposition = (category: string): CompositionItem[] => {
  let composition: CompositionItem[] = [];

  switch (category) {
    case "Logística":
      composition = [
        { label: "Galpões Logísticos", value: 75, color: "#4361EE" },
        { label: "Centros de Distribuição", value: 15, color: "#3A0CA3" },
        { label: "Ativos Financeiros", value: 7, color: "#4CC9F0" },
        { label: "Caixa", value: 3, color: "#F72585" },
      ];
      break;
    case "Shoppings":
      composition = [
        { label: "Shopping Centers", value: 80, color: "#4361EE" },
        { label: "Lojas de Rua", value: 10, color: "#3A0CA3" },
        { label: "Ativos Financeiros", value: 7, color: "#4CC9F0" },
        { label: "Caixa", value: 3, color: "#F72585" },
      ];
      break;
    case "Recebíveis":
      composition = [
        { label: "CRI", value: 85, color: "#4361EE" },
        { label: "LCI", value: 8, color: "#3A0CA3" },
        { label: "Outros Recebíveis", value: 5, color: "#4CC9F0" },
        { label: "Caixa", value: 2, color: "#F72585" },
      ];
      break;
    case "Híbrido":
      composition = [
        { label: "Imóveis Comerciais", value: 40, color: "#4361EE" },
        { label: "Galpões Logísticos", value: 25, color: "#3A0CA3" },
        { label: "CRIs", value: 20, color: "#4CC9F0" },
        { label: "Shopping Centers", value: 10, color: "#7209B7" },
        { label: "Caixa", value: 5, color: "#F72585" },
      ];
      break;
    case "Papel":
      composition = [
        { label: "CRI", value: 60, color: "#4361EE" },
        { label: "LCI/LCA", value: 25, color: "#3A0CA3" },
        { label: "Debêntures", value: 10, color: "#4CC9F0" },
        { label: "Caixa", value: 5, color: "#F72585" },
      ];
      break;
    case "Fundos de Fundos":
      composition = [
        { label: "FIIs de Tijolos", value: 50, color: "#4361EE" },
        { label: "FIIs de Papel", value: 35, color: "#3A0CA3" },
        { label: "Ativos Financeiros", value: 10, color: "#4CC9F0" },
        { label: "Caixa", value: 5, color: "#F72585" },
      ];
      break;
    default:
      composition = [
        { label: "Imóveis", value: 70, color: "#4361EE" },
        { label: "Ativos Financeiros", value: 20, color: "#3A0CA3" },
        { label: "Caixa", value: 10, color: "#F72585" },
      ];
  }

  return composition;
};

// Lista inicial de FIIs
const initialMockFIIs: FII[] = [
  {
    id: "1",
    ticker: "BTLG11",
    name: "BTG Pactual Logística",
    price: 97.47,
    changePercent: 1.49,
    dividend: 0.85,
    dividendYield: 10.0,
    patrimony: 102.0,
    pvp: 0.96,
    category: "Logística",
  },
  {
    id: "2",
    ticker: "KNCR11",
    name: "Kinea Rendimentos Imobiliários",
    price: 102.45,
    changePercent: 0.25,
    dividend: 0.92,
    dividendYield: 9.5,
    patrimony: 105.33,
    pvp: 0.97,
    category: "Recebíveis",
  },
  {
    id: "3",
    ticker: "HGLG11",
    name: "CSHG Logística",
    price: 155.8,
    changePercent: -0.75,
    dividend: 1.2,
    dividendYield: 8.8,
    patrimony: 165.0,
    pvp: 0.94,
    category: "Logística",
  },
  {
    id: "4",
    ticker: "MXRF11",
    name: "Maxi Renda",
    price: 10.5,
    changePercent: 1.25,
    dividend: 0.12,
    dividendYield: 11.5,
    patrimony: 11.0,
    pvp: 0.95,
    category: "Híbrido",
  },
  {
    id: "5",
    ticker: "XPLG11",
    name: "XP Log",
    price: 102.8,
    changePercent: 0.65,
    dividend: 0.95,
    dividendYield: 9.2,
    patrimony: 110.0,
    pvp: 0.93,
    category: "Logística",
  },
  {
    id: "6",
    ticker: "HGBS11",
    name: "CSHG Renda Urbana",
    price: 125.2,
    changePercent: -0.35,
    dividend: 1.05,
    dividendYield: 8.7,
    patrimony: 135.0,
    pvp: 0.92,
    category: "Híbrido",
  },
  {
    id: "7",
    ticker: "VISC11",
    name: "Vinci Shopping Centers",
    price: 105.9,
    changePercent: 1.85,
    dividend: 0.88,
    dividendYield: 9.8,
    patrimony: 115.0,
    pvp: 0.92,
    category: "Shoppings",
  },
  {
    id: "8",
    ticker: "XPML11",
    name: "XP Malls",
    price: 98.75,
    changePercent: 0.45,
    dividend: 0.82,
    dividendYield: 9.0,
    patrimony: 105.0,
    pvp: 0.94,
    category: "Shoppings",
  },
  {
    id: "9",
    ticker: "HFOF11",
    name: "Hedge Top FOFII",
    price: 87.5,
    changePercent: 0.95,
    dividend: 0.75,
    dividendYield: 10.2,
    patrimony: 95.0,
    pvp: 0.92,
    category: "Fundos de Fundos",
  },
  {
    id: "10",
    ticker: "KNIP11",
    name: "Kinea Índices de Preços",
    price: 105.15,
    changePercent: 0.15,
    dividend: 0.9,
    dividendYield: 9.8,
    patrimony: 108.0,
    pvp: 0.97,
    category: "Papel",
  },
  // Adicionando mais FIIs para ter uma lista mais completa
  {
    id: "11",
    ticker: "HSML11",
    name: "HSI Malls",
    price: 89.75,
    changePercent: 0.63,
    dividend: 0.79,
    dividendYield: 9.5,
    patrimony: 95.3,
    pvp: 0.94,
    category: "Shoppings",
  },
  {
    id: "12",
    ticker: "VILG11",
    name: "Vinci Logística",
    price: 110.25,
    changePercent: -0.25,
    dividend: 0.95,
    dividendYield: 8.9,
    patrimony: 120.1,
    pvp: 0.92,
    category: "Logística",
  },
  {
    id: "13",
    ticker: "IRDM11",
    name: "Iridium Recebíveis",
    price: 105.8,
    changePercent: 0.12,
    dividend: 1.1,
    dividendYield: 10.5,
    patrimony: 104.9,
    pvp: 1.01,
    category: "Recebíveis",
  },
  {
    id: "14",
    ticker: "HGRE11",
    name: "CSHG Real Estate",
    price: 142.35,
    changePercent: -0.85,
    dividend: 1.05,
    dividendYield: 7.8,
    patrimony: 155.0,
    pvp: 0.92,
    category: "Lajes Corporativas",
  },
  {
    id: "15",
    ticker: "BCFF11",
    name: "BTG Pactual Fundo de Fundos",
    price: 71.5,
    changePercent: 0.7,
    dividend: 0.63,
    dividendYield: 9.5,
    patrimony: 82.0,
    pvp: 0.87,
    category: "Fundos de Fundos",
  },
  {
    id: "16",
    ticker: "RECR11",
    name: "REC Recebíveis",
    price: 96.25,
    changePercent: 0.32,
    dividend: 0.95,
    dividendYield: 11.2,
    patrimony: 97.1,
    pvp: 0.99,
    category: "Recebíveis",
  },
  {
    id: "17",
    ticker: "RECT11",
    name: "REC Renda Imobiliária",
    price: 72.3,
    changePercent: -0.45,
    dividend: 0.6,
    dividendYield: 9.8,
    patrimony: 78.4,
    pvp: 0.92,
    category: "Híbrido",
  },
  {
    id: "18",
    ticker: "RBRR11",
    name: "RBR High Grade",
    price: 99.1,
    changePercent: 0.15,
    dividend: 0.88,
    dividendYield: 10.2,
    patrimony: 100.5,
    pvp: 0.99,
    category: "Recebíveis",
  },
  {
    id: "19",
    ticker: "HCTR11",
    name: "Hectare CE",
    price: 113.2,
    changePercent: 0.72,
    dividend: 1.05,
    dividendYield: 10.5,
    patrimony: 115.0,
    pvp: 0.98,
    category: "Recebíveis",
  },
  {
    id: "20",
    ticker: "RBRL11",
    name: "RBR Log",
    price: 108.45,
    changePercent: -0.2,
    dividend: 0.9,
    dividendYield: 8.7,
    patrimony: 120.0,
    pvp: 0.9,
    category: "Logística",
  },
  {
    id: "21",
    ticker: "FIGS11",
    name: "General Shopping e Outlets",
    price: 38.25,
    changePercent: 1.25,
    dividend: 0.39,
    dividendYield: 11.5,
    patrimony: 40.1,
    pvp: 0.95,
    category: "Shoppings",
  },
  {
    id: "22",
    ticker: "CPTS11",
    name: "Capitânia Securities II",
    price: 91.35,
    changePercent: 0.45,
    dividend: 0.85,
    dividendYield: 10.8,
    patrimony: 93.0,
    pvp: 0.98,
    category: "Recebíveis",
  },
  {
    id: "23",
    ticker: "XPPR11",
    name: "XP Properties",
    price: 68.8,
    changePercent: -1.05,
    dividend: 0.52,
    dividendYield: 9.0,
    patrimony: 75.0,
    pvp: 0.92,
    category: "Lajes Corporativas",
  },
  {
    id: "24",
    ticker: "VGIR11",
    name: "Valora RE III",
    price: 97.45,
    changePercent: 0.32,
    dividend: 0.95,
    dividendYield: 10.7,
    patrimony: 98.5,
    pvp: 0.99,
    category: "Recebíveis",
  },
  {
    id: "25",
    ticker: "SADI11",
    name: "Santander Agências",
    price: 87.65,
    changePercent: -0.25,
    dividend: 0.75,
    dividendYield: 9.5,
    patrimony: 95.0,
    pvp: 0.92,
    category: "Agências Bancárias",
  },
  {
    id: "26",
    ticker: "HGRU11",
    name: "CSHG Renda Urbana",
    price: 115.45,
    changePercent: 0.65,
    dividend: 0.95,
    dividendYield: 9.2,
    patrimony: 122.0,
    pvp: 0.95,
    category: "Híbrido",
  },
  {
    id: "27",
    ticker: "JSRE11",
    name: "JS Real Estate Multigestão",
    price: 78.9,
    changePercent: -0.4,
    dividend: 0.65,
    dividendYield: 8.9,
    patrimony: 85.0,
    pvp: 0.93,
    category: "Lajes Corporativas",
  },
  {
    id: "28",
    ticker: "VRTA11",
    name: "Fator Verita",
    price: 105.3,
    changePercent: 0.15,
    dividend: 1.05,
    dividendYield: 11.2,
    patrimony: 106.2,
    pvp: 0.99,
    category: "Recebíveis",
  },
  {
    id: "29",
    ticker: "KNRI11",
    name: "Kinea Renda Imobiliária",
    price: 138.75,
    changePercent: -0.35,
    dividend: 0.95,
    dividendYield: 7.5,
    patrimony: 155.0,
    pvp: 0.89,
    category: "Híbrido",
  },
  {
    id: "30",
    ticker: "RZTR11",
    name: "Riza Terrax",
    price: 122.8,
    changePercent: 0.95,
    dividend: 1.1,
    dividendYield: 9.8,
    patrimony: 125.0,
    pvp: 0.98,
    category: "Agronegócio",
  },
];

// Função para gerar mais FIIs com base em templates - modificada para usar initialMockFIIs
const generateMoreFIIs = (): FII[] => {
  // Templates de nomes de gestoras por categoria
  const managers = {
    Logística: [
      "BTG Pactual",
      "XP Asset",
      "CSHG",
      "RBR",
      "Vinci Partners",
      "HSI",
      "Hedge",
      "VBI",
      "Rio Bravo",
      "Mogno",
    ],
    Shoppings: [
      "XP Malls",
      "Vinci Shopping",
      "HSI Malls",
      "CSHG Shopping",
      "Ancar Ivanhoe",
      "Hedge Shopping",
      "BlueMacaw",
      "Suno",
      "Rio Bravo",
      "BTG",
    ],
    "Lajes Corporativas": [
      "CSHG",
      "Kinea",
      "JS Real Estate",
      "BTG Pactual",
      "Rio Bravo",
      "XP Asset",
      "Hedge",
      "HSI",
      "Tellus",
      "Vinci",
    ],
    Residencial: [
      "Suno",
      "Cyrela",
      "Kinea",
      "Even",
      "RBR",
      "VBI",
      "Habitat",
      "BlueCap",
      "Riza",
      "EcoVillas",
    ],
    Híbrido: [
      "REC",
      "CSHG",
      "Kinea",
      "XP Asset",
      "BTG Pactual",
      "Vinci",
      "RBR",
      "HSI",
      "BlueMacaw",
      "Tellus",
    ],
    Papel: [
      "Kinea",
      "Capitânia",
      "CSHG",
      "VBI",
      "RBR High Grade",
      "Valora",
      "Hectare",
      "Iridium",
      "REC",
      "Devant",
    ],
    Recebíveis: [
      "Kinea",
      "CSHG",
      "Hectare",
      "Valora",
      "RBR",
      "Iridium",
      "REC",
      "Devant",
      "Banco Plural",
      "Capitânia",
    ],
    "Fundos de Fundos": [
      "Hedge",
      "BTG Pactual",
      "Kinea",
      "VBI",
      "XP Asset",
      "CSHG",
      "RBR",
      "HSI",
      "Rio Bravo",
      "Mogno",
    ],
    "Agências Bancárias": [
      "Santander",
      "Banco do Brasil",
      "Bradesco",
      "Itaú",
      "BTG Pactual",
      "Banco Inter",
      "CSHG",
      "XP Asset",
      "Hedge",
      "Vinci",
    ],
    Educacional: [
      "CSHG",
      "Vinci",
      "XP Asset",
      "BTG Pactual",
      "RBR",
      "HSI",
      "Hedge",
      "Rio Bravo",
      "Suno",
      "BlueMacaw",
    ],
    Hospitalar: [
      "HSI",
      "CSHG",
      "Kinea",
      "XP Asset",
      "BTG Pactual",
      "Vinci",
      "RBR",
      "Mogno",
      "Rio Bravo",
      "Tellus",
    ],
    Hotéis: [
      "XP Asset",
      "BTG Pactual",
      "HSI",
      "CSHG",
      "Vinci",
      "Rio Bravo",
      "RBR",
      "Mogno",
      "Hedge",
      "Suno",
    ],
    Agronegócio: [
      "Riza",
      "BTG Pactual",
      "XP Asset",
      "Hedge",
      "CSHG",
      "Kinea",
      "Valora",
      "RBR",
      "Rio Bravo",
      "VBI",
    ],
    Desenvolvimento: [
      "Even",
      "Cyrela",
      "Direcional",
      "MRV",
      "HSI",
      "Kinea",
      "BTG Pactual",
      "XP Asset",
      "RBR",
      "VBI",
    ],
  };

  // Templates de sufixos para tickers
  const suffixes = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "21",
    "22",
    "23",
    "31",
    "B11",
    "A11",
  ];

  // Categorias adicionais além das existentes
  const allCategories = [
    "Logística",
    "Shoppings",
    "Lajes Corporativas",
    "Híbrido",
    "Papel",
    "Residencial",
    "Recebíveis",
    "Fundos de Fundos",
    "Agências Bancárias",
    "Educacional",
    "Hospitalar",
    "Hotéis",
    "Agronegócio",
    "Desenvolvimento",
  ];

  // Gerar lista de códigos de FIIs (4 letras + 2 números) com múltiplas combinações
  const generateTickers = (count: number): string[] => {
    const prefixes = [
      "ABCP",
      "ACTI",
      "AFHI",
      "AIEC",
      "ALMI",
      "ALZR",
      "ARCT",
      "ARRI",
      "ATSA",
      "ATCR",
      "AVLL",
      "BARI",
      "BBFI",
      "BBFO",
      "BBPO",
      "BCFF",
      "BCRI",
      "BDIF",
      "BEVT",
      "BICE",
      "BICR",
      "BIME",
      "BLCA",
      "BLCI",
      "BLCP",
      "BLMO",
      "BLMR",
      "BMII",
      "BNFS",
      "BPFF",
      "BPLC",
      "BPRP",
      "BRCR",
      "BREV",
      "BRHT",
      "BRIP",
      "BRITA",
      "BTAL",
      "BTCI",
      "BTLG",
      "BTSG",
      "BTRA",
      "BTRV",
      "BTWR",
      "CALI",
      "CARE",
      "CBOP",
      "CCRF",
      "CEOC",
      "CFFP",
      "CFII",
      "CJCT",
      "CKZM",
      "CODE",
      "CPFF",
      "CPTS",
      "CRFF",
      "CTXT",
      "CVBI",
      "CYCR",
      "CXTL",
      "DCFF",
      "DCRI",
      "DCVM",
      "DEVT",
      "DEVA",
      "DMAC",
      "DOHL",
      "DOVL",
      "DRIT",
      "DVFF",
      "EDFO",
      "EDGA",
      "ELDO",
      "ESPA",
      "EURO",
      "EVBI",
      "EXTO",
      "FAED",
      "FAMB",
      "FEXC",
      "FFCM",
      "FFCI",
      "FGAA",
      "FGQD",
      "FIGS",
      "FIIB",
      "FIIP",
      "FINF",
      "FISC",
      "FISD",
      "FITB",
      "FLCR",
      "FLRP",
      "FMOF",
      "FPAB",
      "FPNG",
      "FRBR",
      "FRES",
      "FRVS",
      "FSSA",
      "FUND",
      "GALG",
      "GCFF",
      "GCRI",
      "GESE",
      "GIFF",
      "GSFI",
      "GTWR",
      "HAAA",
      "HABT",
      "HBCR",
      "HBTT",
      "HCTR",
      "HCVE",
      "HDCR",
      "HFOF",
      "HGBS",
      "HGCR",
      "HGLG",
      "HGPO",
      "HGRE",
      "HGRU",
      "HLOG",
      "HMOC",
      "HOME",
      "HOSI",
      "HRDF",
      "HREC",
      "HSLG",
      "HSML",
      "HSRE",
      "HTMX",
      "HUSC",
      "IBCR",
      "IBFF",
      "IFIE",
      "IFRA",
      "IGTA",
      "IRDM",
      "JBFO",
      "JFLL",
      "JSAF",
      "JSRE",
      "JTPR",
      "JRDM",
      "KFOF",
      "KINP",
      "KISU",
      "KNCR",
      "KNHY",
      "KNIP",
      "KNRI",
      "KNSC",
      "LASC",
      "LATR",
      "LBRI",
      "LGCP",
      "LIFE",
      "LIGA",
      "LUGG",
      "LVBI",
      "MALL",
      "MAXR",
      "MBRF",
      "MCCI",
      "MCFF",
      "MCRI",
      "MGCR",
      "MGFF",
      "MGHT",
      "MGLG",
      "MGRC",
      "MGRT",
      "MLOG",
      "MORE",
      "MPLV",
      "MXRF",
      "NCHB",
      "NEWL",
      "NPAR",
      "NSLU",
      "NVHO",
      "OFIX",
      "ONEF",
      "ORPD",
      "OUFF",
      "OULG",
      "OURE",
      "OURQ",
      "OUSC",
      "OUVR",
      "PATB",
      "PATC",
      "PATL",
      "PCRF",
      "PGEN",
      "PLCR",
      "PLOG",
      "PORD",
      "PQDP",
      "PQRC",
      "PRSN",
      "PRVP",
      "PSBY",
      "PVBI",
      "QAGR",
      "QAMI",
      "QIFF",
      "QIRI",
      "QMFF",
      "RBCO",
      "RBED",
      "RBFF",
      "RBHY",
      "RBIR",
      "RBIV",
      "RBLG",
      "RBRD",
      "RBRF",
      "RBRL",
      "RBRO",
      "RBRP",
      "RBRS",
      "RBRY",
      "RBRR",
      "RBRY",
      "RBSI",
      "RBTI",
      "RBTS",
      "RBVA",
      "RBVO",
      "RCFA",
      "RCFF",
      "RCKO",
      "RCRB",
      "RCRI",
      "RCSO",
      "RCSY",
      "RDPD",
      "RDRP",
      "RECR",
      "RECT",
      "RELG",
      "REVE",
      "RFOF",
      "RFSL",
      "RNDP",
      "RNGO",
      "RNOV",
      "RPLP",
      "RPTD",
      "RSPD",
      "RSID",
      "RVBM",
      "RVSC",
      "RZAK",
      "RZTR",
      "SADI",
      "SATI",
      "SBCL",
      "SBTD",
      "SBVT",
      "SCCP",
      "SCPF",
      "SDIL",
      "SDIP",
      "SEQR",
      "SIGH",
      "SIGR",
      "SJBF",
      "SKED",
      "SNAG",
      "SNCI",
      "SNFF",
      "SPAF",
      "SPTW",
      "SPVJ",
      "STRE",
      "STRX",
      "TELD",
      "TEPP",
      "TGAR",
      "THRA",
      "TIFF",
      "TRNT",
      "TRPF",
      "TRXF",
      "URPR",
      "VCJR",
      "VCRR",
      "VERE",
      "VFOF",
      "VGFF",
      "VGIR",
      "VIDS",
      "VIIG",
      "VILG",
      "VINO",
      "VISC",
      "VIUR",
      "VJFD",
      "VLJS",
      "VLOL",
      "VOTS",
      "VPLA",
      "VRTA",
      "VSHO",
      "VSIT",
      "VTLT",
      "VTPA",
      "VTUI",
      "VVPR",
      "VTNI",
      "VVOF",
      "XPCM",
      "XPIN",
      "XPLG",
      "XPML",
      "XPPR",
      "XPSF",
      "XTED",
      "YURA",
      "ZIFI",
    ];

    const tickers: string[] = [];

    for (const prefix of prefixes) {
      for (const suffix of suffixes) {
        tickers.push(`${prefix}${suffix}`);
        if (tickers.length >= count) {
          return tickers;
        }
      }
    }

    return tickers;
  };

  // Gera os tickers
  const tickers = generateTickers(650);

  // Lista existente para evitar duplicação - agora usando initialMockFIIs
  const existingTickers = initialMockFIIs.map((fii) => fii.ticker);

  // Filtra apenas os tickers que ainda não existem
  const newTickers = tickers.filter(
    (ticker) => !existingTickers.includes(ticker),
  );

  // Gera FIIs complementares
  const additionalFIIs: FII[] = [];
  let id = initialMockFIIs.length + 1;

  for (const ticker of newTickers) {
    // Define a categoria aleatoriamente
    const category =
      allCategories[Math.floor(Math.random() * allCategories.length)];

    // Pega gestora aleatória da categoria
    const manager =
      managers[category as keyof typeof managers][
        Math.floor(
          Math.random() * managers[category as keyof typeof managers].length,
        )
      ];

    // Define nome do fundo
    const fundName = `${manager} ${category}`;

    // Define preço base entre 60 e 180, com exceções para fundos mais baratos (10-20)
    let basePrice = Math.random() * 120 + 60;
    if (Math.random() < 0.1) {
      // 10% de chance de ser um FII barato
      basePrice = Math.random() * 10 + 10;
    }
    basePrice = parseFloat(basePrice.toFixed(2));

    // Define variação percentual (-2% a +2%)
    const changePercent = parseFloat((Math.random() * 4 - 2).toFixed(2));

    // Define dividend yield (5% a 13%)
    const dividendYield = parseFloat((Math.random() * 8 + 5).toFixed(1));

    // Define patrimônio 85% a 115% do preço
    const pvpFactor = 0.85 + Math.random() * 0.3;
    const patrimony = parseFloat((basePrice / pvpFactor).toFixed(2));

    // Define P/VP
    const pvp = parseFloat((basePrice / patrimony).toFixed(2));

    // Define valor do dividendo
    const dividend = parseFloat(
      ((basePrice * dividendYield) / 100 / 12).toFixed(2),
    );

    additionalFIIs.push({
      id: String(id++),
      ticker,
      name: fundName,
      price: basePrice,
      changePercent,
      dividend,
      dividendYield,
      patrimony,
      pvp,
      category,
      logoUrl:
        Math.random() > 0.7
          ? `https://example.com/logos/${ticker}.png`
          : undefined,
    });
  }

  return additionalFIIs;
};

// Expansão da lista de FIIs combinando os 30 iniciais com os gerados dinamicamente
const mockFIIs: FII[] = [...initialMockFIIs].concat(generateMoreFIIs());

// API URLs
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";
const B3_API_URL =
  "https://api.b3.cotacoes.mercadofinanceiro.com.br/api/quote/";

// Classe do serviço FII
class FIIService {
  // Implementação de cache para evitar muitas chamadas à API
  private cache: {
    fiis?: FII[];
    lastUpdate?: Date;
    realTimeData?: { [ticker: string]: any };
    realTimeLastUpdate?: Date;
  } = {};

  // Método para tentar obter dados reais da API da B3 (simulado)
  private async fetchRealTimeData(ticker: string): Promise<any> {
    try {
      // Simular requisições reais - em um ambiente real, usaria:
      // const response = await axios.get(`${B3_API_URL}${ticker}`);
      // return response.data;

      // Por enquanto, simula dados com maior variação para dar impressão de dados ao vivo
      const mockFII = mockFIIs.find((fii) => fii.ticker === ticker);
      if (!mockFII) return null;

      const variation = (Math.random() - 0.5) * 0.5; // Maior variação para simular dados reais (-0.25% a +0.25%)
      const newPrice = Math.max(mockFII.price * (1 + variation), 0.01);
      const changePercent = mockFII.changePercent + (Math.random() - 0.5); // Maior variação

      // Simula uma estrutura de resposta API
      return {
        ticker,
        name: mockFII.name,
        price: parseFloat(newPrice.toFixed(2)),
        change: parseFloat(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Erro ao obter dados reais para ${ticker}:`, error);
      return null;
    }
  }

  // Atualizar vários tickers com dados mais realistas
  private async updateMultipleTickers(
    tickers: string[],
  ): Promise<{ [ticker: string]: any }> {
    const results: { [ticker: string]: any } = {};

    // Limita a 20 chamadas paralelas para não sobrecarregar
    const batchSize = 20;
    for (let i = 0; i < tickers.length; i += batchSize) {
      const batch = tickers.slice(i, i + batchSize);
      const promises = batch.map((ticker) => this.fetchRealTimeData(ticker));
      const batchResults = await Promise.all(promises);

      batchResults.forEach((result, index) => {
        if (result) {
          results[batch[index]] = result;
        }
      });
    }

    return results;
  }

  // Buscar todos os FIIs
  async getAllFIIs(): Promise<FII[]> {
    try {
      // Verificar cache
      const cacheTimeValid =
        this.cache.lastUpdate &&
        new Date().getTime() - this.cache.lastUpdate.getTime() < 60000; // 1 minuto

      if (this.cache.fiis && cacheTimeValid) {
        return this.cache.fiis;
      }

      // Em um cenário real, faríamos uma chamada à API
      // const response = await axios.get(`${API_URL}/fiis`);
      // const data = response.data;

      // Por enquanto, retornamos dados mockados
      this.cache.fiis = mockFIIs;
      this.cache.lastUpdate = new Date();

      return mockFIIs;
    } catch (error) {
      console.error("Erro ao buscar FIIs:", error);
      return mockFIIs; // Fallback para dados mockados em caso de erro
    }
  }

  // Buscar FIIs por termo de busca
  async searchFIIs(searchTerm: string): Promise<FII[]> {
    try {
      // Em um cenário real, faríamos uma chamada à API
      // const response = await axios.get(`${API_URL}/fiis/search?term=${searchTerm}`);
      // return response.data;

      // Por enquanto, filtramos os dados mockados
      const term = searchTerm.toLowerCase();
      const filtered = mockFIIs.filter(
        (fii) =>
          fii.ticker.toLowerCase().includes(term) ||
          fii.name.toLowerCase().includes(term),
      );
      return Promise.resolve(filtered);
    } catch (error) {
      console.error("Erro ao buscar FIIs:", error);
      return []; // Retorna array vazio em caso de erro
    }
  }

  // Buscar detalhes de um FII específico
  async getFIIDetails(ticker: string): Promise<FIIDetails | null> {
    try {
      // Em um cenário real, faríamos uma chamada à API
      // const response = await axios.get(`${API_URL}/fiis/${ticker}`);
      // return response.data;

      // Por enquanto, retornamos dados mockados
      return Promise.resolve(getMockFIIDetails(ticker));
    } catch (error) {
      console.error(`Erro ao buscar detalhes do FII ${ticker}:`, error);
      return null;
    }
  }

  // Buscar FIIs por categoria
  async getFIIsByCategory(category: string): Promise<FII[]> {
    try {
      // Em um cenário real, faríamos uma chamada à API
      // const response = await axios.get(`${API_URL}/fiis/category/${category}`);
      // return response.data;

      // Por enquanto, filtramos os dados mockados
      const filtered =
        category === "Todos"
          ? mockFIIs
          : mockFIIs.filter((fii) => fii.category === category);
      return Promise.resolve(filtered);
    } catch (error) {
      console.error(`Erro ao buscar FIIs da categoria ${category}:`, error);
      return []; // Retorna array vazio em caso de erro
    }
  }

  // Buscar FIIs em destaque
  async getFeaturedFIIs(): Promise<FII[]> {
    try {
      // Em um cenário real, faríamos uma chamada à API
      // const response = await axios.get(`${API_URL}/fiis/featured`);
      // return response.data;

      // Por enquanto, selecionamos alguns dos dados mockados
      return Promise.resolve(mockFIIs.slice(0, 4));
    } catch (error) {
      console.error("Erro ao buscar FIIs em destaque:", error);
      return []; // Retorna array vazio em caso de erro
    }
  }

  // Filtrar histórico de preços por período
  async getPriceHistoryByPeriod(
    ticker: string,
    period: string,
  ): Promise<PriceHistoryItem[]> {
    try {
      const details = await this.getFIIDetails(ticker);
      if (!details) return [];

      const now = new Date();
      let startDate = new Date();

      // Definir a data de início com base no período selecionado
      switch (period) {
        case "1 Mês":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "3 Meses":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "6 Meses":
          startDate.setMonth(now.getMonth() - 6);
          break;
        case "1 Ano":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case "Máximo":
          // Retorna todo o histórico disponível
          return details.priceHistory;
        default:
          startDate.setMonth(now.getMonth() - 6); // Default: 6 meses
      }

      // Converter para timestamp para comparação
      const startTimestamp = startDate.getTime();

      // Filtrar apenas os pontos dentro do período selecionado
      const filteredHistory = details.priceHistory.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getTime() >= startTimestamp;
      });

      return filteredHistory;
    } catch (error) {
      console.error(
        `Erro ao buscar histórico de preços para ${ticker}:`,
        error,
      );
      return [];
    }
  }

  // Simular dados de atualização em tempo real
  simulateRealTimeUpdate(fii: FII): FII {
    // Simula pequenas variações no preço e na variação percentual
    const priceChange = (Math.random() - 0.5) * 0.1; // Variação de até ±0.05
    const newPrice = Math.max(fii.price + priceChange, 0.01);
    const newChangePercent = fii.changePercent + (Math.random() - 0.5) * 0.2; // Variação de até ±0.1%

    return {
      ...fii,
      price: parseFloat(newPrice.toFixed(2)),
      changePercent: parseFloat(newChangePercent.toFixed(2)),
    };
  }

  // Atualizar dados em "tempo real" aprimorado
  async getRealTimeUpdates(): Promise<FII[]> {
    try {
      // Obter todos os FIIs primeiro
      const fiis = await this.getAllFIIs();

      // Verificar cache de dados em tempo real
      const cacheTimeValid =
        this.cache.realTimeLastUpdate &&
        new Date().getTime() - this.cache.realTimeLastUpdate.getTime() < 10000; // 10 segundos

      // Se o cache for válido, retornar dados do cache
      if (this.cache.realTimeData && cacheTimeValid) {
        return this.applyRealTimeData(fiis, this.cache.realTimeData);
      }

      // Seleciona aleatoriamente 30-50 FIIs para atualizar para simular dados reais (para performance)
      const randomFiis = [...fiis]
        .sort(() => Math.random() - 0.5)
        .slice(0, 30 + Math.floor(Math.random() * 20));

      const tickersToUpdate = randomFiis.map((fii) => fii.ticker);

      // Atualizar dados em tempo real
      const realTimeData = await this.updateMultipleTickers(tickersToUpdate);

      // Atualizar cache
      this.cache.realTimeData = realTimeData;
      this.cache.realTimeLastUpdate = new Date();

      // Aplicar dados em tempo real aos FIIs
      return this.applyRealTimeData(fiis, realTimeData);
    } catch (error) {
      console.error("Erro ao obter atualizações em tempo real:", error);

      // Em caso de erro, ainda podemos simular
      const fiis = await this.getAllFIIs();
      return fiis.map((fii) => this.simulateRealTimeUpdate(fii));
    }
  }

  // Aplicar dados em tempo real aos FIIs
  private applyRealTimeData(
    fiis: FII[],
    realTimeData: { [ticker: string]: any },
  ): FII[] {
    return fiis.map((fii: FII) => {
      const realtimeInfo = realTimeData[fii.ticker];

      if (realtimeInfo) {
        return {
          ...fii,
          price: realtimeInfo.price,
          changePercent: realtimeInfo.change,
          lastUpdate: realtimeInfo.timestamp,
        };
      }

      // Se não tiver dados em tempo real, simular
      return this.simulateRealTimeUpdate(fii);
    });
  }
}

// Exporta uma instância do serviço
export const fiiService = new FIIService();

// Exporta também os dados mockados para uso em desenvolvimento
export { mockFIIs };

// Detalhes do FII mockados com dados mais realistas
const getMockFIIDetails = (ticker: string): FIIDetails => {
  const baseFII = mockFIIs.find((fii) => fii.ticker === ticker) || mockFIIs[0];

  const priceHistory = generatePriceHistory(baseFII.price);
  const dividendHistory = generateDividendHistory(
    baseFII.dividendYield,
    baseFII.price,
  );
  const composition = generateComposition(baseFII.category);

  return {
    ...baseFII,
    ticker: ticker,
    name: baseFII.name,
    assetValue: baseFII.patrimony,
    lastDividend: baseFII.dividend,
    liquidPatrimony: Math.round(baseFII.price * 6500 * 1000), // Simulação de patrimônio líquido
    dailyLiquidity: Math.round(baseFII.price * 65 * 1000), // Simulação de liquidez diária
    marketValue: Math.round(baseFII.price * 6000 * 1000), // Simulação de valor de mercado
    description: `O ${ticker} é um fundo de investimento imobiliário administrado por ${baseFII.category === "Logística" ? "BTG Pactual" : baseFII.category === "Recebíveis" ? "Kinea" : "CSHG"}, que tem como objetivo o investimento em empreendimentos imobiliários do segmento de ${baseFII.category.toLowerCase()}. O fundo busca proporcionar aos seus cotistas rentabilidade através da distribuição de rendimentos e ganho de capital.`,
    manager: `${baseFII.category === "Logística" ? "BTG Pactual" : baseFII.category === "Recebíveis" ? "Kinea" : "CSHG"} Gestora de Recursos`,
    dividendHistory,
    priceHistory,
    composition,
  };
};
