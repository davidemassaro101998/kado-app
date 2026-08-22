// Wizard budget-tier thresholds per currency, and where the symbol sits
// (prefix for $/£/¥/₹-style currencies, suffix for €/kr/zł-style ones).
// These used to be a single hardcoded "< 25€ / 25-50€ / 50-100€ / 100€+"
// shown to every visitor regardless of selected country -- fine for EUR,
// silently wrong everywhere else: same numbers with a swapped symbol are
// nonsensical for a currency with a very different unit scale (25-50 JPY
// is about 20 euro cents, not a gift budget).
//
// Approximate, rounded to sensible amounts -- not a live FX feed. Good
// enough for "what tier of gift is this," which is all these buttons need
// to communicate; revisit if a currency's real-world prices drift a lot.

export interface BudgetBandConfig {
  thresholds: [number, number, number];
  symbolPosition: "prefix" | "suffix";
}

export const BUDGET_BANDS: Record<string, BudgetBandConfig> = {
  EUR: { thresholds: [25, 50, 100], symbolPosition: "suffix" },
  USD: { thresholds: [25, 50, 100], symbolPosition: "prefix" },
  GBP: { thresholds: [20, 45, 90], symbolPosition: "prefix" },
  CAD: { thresholds: [35, 70, 140], symbolPosition: "prefix" },
  AUD: { thresholds: [40, 80, 160], symbolPosition: "prefix" },
  JPY: { thresholds: [3000, 6000, 12000], symbolPosition: "prefix" },
  MXN: { thresholds: [500, 1000, 2000], symbolPosition: "prefix" },
  BRL: { thresholds: [130, 260, 520], symbolPosition: "prefix" },
  INR: { thresholds: [2000, 4000, 8000], symbolPosition: "prefix" },
  SEK: { thresholds: [270, 540, 1100], symbolPosition: "suffix" },
  PLN: { thresholds: [110, 220, 440], symbolPosition: "suffix" },
  SGD: { thresholds: [35, 70, 140], symbolPosition: "prefix" },
  AED: { thresholds: [95, 190, 380], symbolPosition: "prefix" },
};

function fmt(amount: number, symbol: string, position: "prefix" | "suffix"): string {
  return position === "prefix" ? `${symbol}${amount}` : `${amount}${symbol}`;
}

export function getBudgetOptions(currency: string, symbol: string): string[] {
  const band = BUDGET_BANDS[currency] || BUDGET_BANDS.EUR;
  const [t1, t2, t3] = band.thresholds;
  const p = band.symbolPosition;
  return [
    `< ${fmt(t1, symbol, p)}`,
    `${fmt(t1, symbol, p)} - ${fmt(t2, symbol, p)}`,
    `${fmt(t2, symbol, p)} - ${fmt(t3, symbol, p)}`,
    `${fmt(t3, symbol, p)}+`,
  ];
}

export function getDefaultBudget(currency: string, symbol: string): string {
  const band = BUDGET_BANDS[currency] || BUDGET_BANDS.EUR;
  const [t1, t2] = band.thresholds;
  const p = band.symbolPosition;
  return `${fmt(t1, symbol, p)} - ${fmt(t2, symbol, p)}`;
}

export function formatCustomBudget(amount: string, currency: string, symbol: string): string {
  const band = BUDGET_BANDS[currency] || BUDGET_BANDS.EUR;
  return band.symbolPosition === "prefix" ? `${symbol}${amount}` : `${amount}${symbol}`;
}
