export type ScreenType = "home" | "quiz" | "loading" | "results";

export type RecipientType = "Partner" | "Famiglia" | "Amico" | "Collega" | "Partner" | "Friend" | "Parent" | "Sibling" | "Child" | string;
export type VibeType = "Relax" | "Tech" | "Casa" | "Viaggi" | "Lusso" | "Fun" | "Cozy" | "Style" | "Foodie" | "Outdoors" | "Creative" | string;
export type FormatPillType = "Tutto" | "Libro" | "Gadget" | "Esperienza";

export interface QuizState {
  eventDate?: string; // YYYY-MM-DD
  recipient: string; // Partner, Famiglia, Amico, Collega...
  occasion?: string;
  budget: string; // <25€, 25-50€, 50-100€, >100€
  vibe: string; // Relax, Tech, Casa, Viaggi, Lusso, Fun...
  formatPill?: FormatPillType | string; // Tutto, Libro, Gadget, Esperienza
  hasAlreadyEverything?: boolean; // Ha già tutto checkbox
  extraDetails?: string; // Dettaglio extra
  fastTrackIdea?: string; // Quick search prompt / SOS
}

export interface GiftItem {
  id: string;
  title: string;
  price: string;
  reason: string;
  matchScore: number;
  tag: string; // "Più Scelto" | "Originale / Libro" | "Top Qualità"
  amazonSearchQuery: string;
  category: string;
  imageUrl: string;
  rating?: number; // e.g. 4.7
  reviewsCount?: number; // e.g. 1480
  isPrime?: boolean;
  asin?: string;
  // "amazon" = real PA-API match (real ASIN, live price/rating). "ai-estimate"
  // (or absent, e.g. from the offline fallback catalog) = Gemini-estimated
  // data — no confirmed ASIN, so the store link can only be a search, never
  // a real cart add. Drives which CTA label ResultsDeckApple shows.
  dataSource?: "amazon" | "ai-estimate";
}

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  amazonDomain: string;
  currency: string;
  symbol: string;
  tag: string;
}

