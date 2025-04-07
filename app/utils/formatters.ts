/**
 * Utilitários para formatação de valores
 */

interface FormatCurrencyOptions {
  locale?: string;
  compact?: boolean;
}

/**
 * Formata um valor para moeda
 */
export function formatCurrency(
  value: number,
  options: FormatCurrencyOptions = {},
): string {
  try {
    const { compact = false } = options;

    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 2,
    });

    return formatter.format(value);
  } catch (error) {
    console.error("Erro ao formatar moeda:", error);
    // Fallback simples em caso de erro
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  }
}

/**
 * Formata um valor para percentual
 */
export function formatPercent(value: number): string {
  try {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(value / 100);
  } catch (error) {
    console.error("Erro ao formatar percentual:", error);
    // Fallback simples em caso de erro
    return `${value.toFixed(2).replace(".", ",")}%`;
  }
}

/**
 * Formata um número
 */
export function formatNumber(value: number): string {
  try {
    const formatter = new Intl.NumberFormat("pt-BR");
    return formatter.format(value);
  } catch (error) {
    console.error("Erro ao formatar número:", error);
    // Fallback simples em caso de erro
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}

/**
 * Formata uma data
 */
export function formatDate(
  dateString: string,
  format: "short" | "long" = "short",
): string {
  try {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions =
      format === "long"
        ? {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        : {
            day: "2-digit",
            month: "2-digit",
          };

    return date.toLocaleDateString("pt-BR", options);
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    // Fallback simples em caso de erro
    return dateString.split("T")[0].split("-").reverse().join("/");
  }
}

/**
 * Formata uma data com hora
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Erro ao formatar data e hora:", error);
    // Fallback simples em caso de erro
    return dateString.replace("T", " ").substring(0, 16).split("-").join("/");
  }
}
