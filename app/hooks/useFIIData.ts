import { useState, useEffect } from "react";

export interface FIIQuote {
  ticker: string;
  price: string;
  change: string;
  isNegative: boolean;
}

export const useFIIData = () => {
  const [quotes, setQuotes] = useState<FIIQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFIIData = async () => {
      try {
        setLoading(true);

        // List of popular FIIs to fetch
        const tickers = [
          "KNRI11",
          "HGLG11",
          "XPLG11",
          "VISC11",
          "HGRE11",
          "MXRF11",
          "BCFF11",
          "HSML11",
          "KNCR11",
          "IRDM11",
          "XPML11",
          "HFOF11",
          "BRCR11",
          "BTLG11",
          "VILG11",
          "RBRR11",
          "RECR11",
          "GGRC11",
          "VGIR11",
          "VINO11",
        ];

        // Using a more reliable API endpoint with API key
        // You should replace 'YOUR_API_KEY' with an actual API key
        const apiKey = "YOUR_API_KEY"; // Consider using environment variables
        const response = await fetch(
          `https://api.hgbrasil.com/finance/stock_price?key=${apiKey}&symbols=${tickers.join(",")}`,
          { headers: { Accept: "application/json" } },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch FII data");
        }

        const data = await response.json();

        // Format the data
        const formattedQuotes: FIIQuote[] = [];

        if (data.results) {
          Object.keys(data.results).forEach((key) => {
            if (key !== "currencies") {
              const stock = data.results[key];
              const changeValue = stock.change?.toFixed(2) || "0.00";
              const isNegative = parseFloat(changeValue) < 0;

              formattedQuotes.push({
                ticker: stock.symbol,
                price: `R$ ${stock.price.toFixed(2).replace(".", ",")}`,
                change: isNegative ? changeValue : `+${changeValue}`,
                isNegative,
              });
            }
          });
        }

        if (formattedQuotes.length > 0) {
          setQuotes(formattedQuotes);
        } else {
          throw new Error("No FII data returned");
        }
      } catch (err) {
        console.error("Error fetching FII data:", err);
        setError("Failed to load FII data");

        // Fallback to static data if API fails - this ensures the UI always shows something
        // In production, you might want to show a more obvious indicator that data is stale
        setQuotes([
          {
            ticker: "KNRI11",
            price: "R$ 111,50",
            change: "-0.45",
            isNegative: true,
          },
          {
            ticker: "HGLG11",
            price: "R$ 107,24",
            change: "+0.42",
            isNegative: false,
          },
          {
            ticker: "XPLG11",
            price: "R$ 91,84",
            change: "0.00",
            isNegative: false,
          },
          {
            ticker: "VISC11",
            price: "R$ 100,90",
            change: "0.00",
            isNegative: false,
          },
          {
            ticker: "HGRE11",
            price: "R$ 124,57",
            change: "+1.46",
            isNegative: false,
          },
          {
            ticker: "MXRF11",
            price: "R$ 9,70",
            change: "-0.30",
            isNegative: true,
          },
          {
            ticker: "BCFF11",
            price: "R$ 65,10",
            change: "+0.20",
            isNegative: false,
          },
          {
            ticker: "HSML11",
            price: "R$ 82,35",
            change: "-0.15",
            isNegative: true,
          },
          {
            ticker: "KNCR11",
            price: "R$ 95,42",
            change: "+0.32",
            isNegative: false,
          },
          {
            ticker: "IRDM11",
            price: "R$ 105,78",
            change: "+0.65",
            isNegative: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFIIData();

    // Refresh data more frequently (every 1 minute) for live updates
    const intervalId = setInterval(fetchFIIData, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { quotes, loading, error };
};
