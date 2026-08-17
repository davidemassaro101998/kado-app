import { describe, expect, it } from "vitest";
import { parseBudgetRange, generateSmartFallbackGifts } from "./mockGifts";
import type { QuizState, CountryConfig } from "../types";
import type { Language } from "./translations";

const IT_COUNTRY: CountryConfig = {
  code: "IT",
  name: "Italia",
  flag: "🇮🇹",
  amazonDomain: "amazon.it",
  currency: "EUR",
  symbol: "€",
  tag: "test-tag-21",
};

function quiz(overrides: Partial<QuizState> = {}): QuizState {
  return {
    recipient: "Partner",
    budget: "25-50€",
    vibe: "Tech",
    ...overrides,
  };
}

describe("parseBudgetRange", () => {
  it("parses a plain range", () => {
    expect(parseBudgetRange("25-50€")).toEqual({ min: 25, max: 50, label: "25-50€" });
  });

  it("parses an under-budget shorthand", () => {
    const range = parseBudgetRange("<25€");
    expect(range.max).toBeLessThanOrEqual(25);
    expect(range.min).toBeLessThan(range.max);
  });

  it("parses an over-budget shorthand", () => {
    const range = parseBudgetRange(">100€");
    expect(range.min).toBe(100);
  });

  it("parses an exact custom amount", () => {
    const range = parseBudgetRange("40");
    expect(range.max).toBe(40);
    expect(range.min).toBeLessThan(40);
  });

  it("falls back to a sane default on garbage input", () => {
    expect(parseBudgetRange("")).toEqual({ min: 25, max: 50, label: "25-50€" });
    expect(parseBudgetRange("not-a-budget")).toEqual({ min: 25, max: 50, label: "25-50€" });
  });
});

describe("generateSmartFallbackGifts", () => {
  const languages: Language[] = ["en", "it", "es", "fr", "de"];

  it("always returns exactly 3 gifts with prices inside the requested budget", () => {
    const gifts = generateSmartFallbackGifts(quiz({ budget: "25-50€" }), IT_COUNTRY, "en");
    expect(gifts).toHaveLength(3);
    for (const gift of gifts) {
      const price = Number(gift.price.replace(/[^0-9.]/g, ""));
      expect(price).toBeGreaterThanOrEqual(25);
      expect(price).toBeLessThanOrEqual(50);
    }
  });

  it("generates non-Italian copy when a non-Italian language is requested", () => {
    // Regression guard: the fallback catalog used to be hardcoded in
    // Italian regardless of the selected language, so a non-Italian
    // visitor who hit the fallback (API down/capped/timeout) would see
    // Italian gift titles no matter what. This must not happen again.
    const gifts = generateSmartFallbackGifts(quiz({ budget: ">100€" }), IT_COUNTRY, "de");
    for (const gift of gifts) {
      expect(gift.title.toLowerCase()).not.toContain("regalo");
    }
  });

  it("produces different, correctly-localized titles per language for the same inputs", () => {
    const titlesByLanguage = languages.map((language) =>
      generateSmartFallbackGifts(quiz({ budget: "50-100€" }), IT_COUNTRY, language).map((g) => g.title)
    );
    // Every language should produce 3 titles, and not every language
    // should be byte-identical (that would mean localization silently
    // fell through to the same fallback for everything).
    const unique = new Set(titlesByLanguage.map((titles) => titles.join("|")));
    expect(unique.size).toBeGreaterThan(1);
  });

  it("substitutes the recipient placeholder instead of leaking the literal token", () => {
    const gifts = generateSmartFallbackGifts(quiz({ recipient: "Marco", budget: "<25€" }), IT_COUNTRY, "it");
    const joined = gifts.map((g) => g.reason).join(" ");
    expect(joined).not.toContain("{recipient}");
  });

  it("matches the padel topic override regardless of language", () => {
    for (const language of languages) {
      const gifts = generateSmartFallbackGifts(quiz({ extraDetails: "ama il padel" }), IT_COUNTRY, language);
      expect(gifts.some((g) => g.category === "outdoors")).toBe(true);
    }
  });

  it("always tags exactly one card per diversification slot (top pick / books / top quality)", () => {
    const gifts = generateSmartFallbackGifts(quiz({ budget: "50-100€" }), IT_COUNTRY, "fr");
    const tags = gifts.map((g) => g.tag);
    expect(new Set(tags).size).toBe(3);
  });
});
