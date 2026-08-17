import { CountryConfig } from "../types";
import { withChannelSuffix } from "../lib/channel";

// Amazon Associate tags are configurable via Vite env vars so real
// tracking IDs can be injected at build/deploy time without touching
// this file. When an env var is unset, we fall back to the existing
// placeholder tag (these are NOT real Associate IDs).
function amazonTag(envVar: string | undefined, fallback: string): string {
  return envVar && envVar.trim() ? envVar.trim() : fallback;
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    amazonDomain: "amazon.com",
    currency: "USD",
    symbol: "$",
    tag: amazonTag(import.meta.env.VITE_AMAZON_TAG_US, "giftai-20"),
  },
  {
    code: "IT",
    name: "Italia",
    flag: "🇮🇹",
    amazonDomain: "amazon.it",
    currency: "EUR",
    symbol: "€",
    tag: amazonTag(import.meta.env.VITE_AMAZON_TAG_IT, "giftai0f-21"),
  },
  {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    amazonDomain: "amazon.co.uk",
    currency: "GBP",
    symbol: "£",
    tag: amazonTag(import.meta.env.VITE_AMAZON_TAG_UK, "giftaiuk-21"),
  },
  {
    code: "DE",
    name: "Deutschland",
    flag: "🇩🇪",
    amazonDomain: "amazon.de",
    currency: "EUR",
    symbol: "€",
    tag: amazonTag(import.meta.env.VITE_AMAZON_TAG_DE, "giftaide-21"),
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    amazonDomain: "amazon.fr",
    currency: "EUR",
    symbol: "€",
    tag: amazonTag(import.meta.env.VITE_AMAZON_TAG_FR, "giftaifr-21"),
  },
  {
    code: "ES",
    name: "España",
    flag: "🇪🇸",
    amazonDomain: "amazon.es",
    currency: "EUR",
    symbol: "€",
    tag: amazonTag(import.meta.env.VITE_AMAZON_TAG_ES, "giftaies-21"),
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    amazonDomain: "amazon.ca",
    currency: "CAD",
    symbol: "CA$",
    tag: amazonTag(import.meta.env.VITE_AMAZON_TAG_CA, "giftaica-20"),
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    amazonDomain: "amazon.co.jp",
    currency: "JPY",
    symbol: "¥",
    tag: amazonTag(import.meta.env.VITE_AMAZON_TAG_JP, "giftaijp-22"),
  },
];

export function detectUserCountry(): CountryConfig {
  try {
    const lang = navigator.language || "en-US";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    if (lang.includes("it") || timeZone.includes("Rome") || timeZone.includes("Europe/Rome")) {
      return COUNTRIES.find((c) => c.code === "IT") || COUNTRIES[0];
    }
    if (lang.includes("en-GB") || timeZone.includes("London")) {
      return COUNTRIES.find((c) => c.code === "UK") || COUNTRIES[0];
    }
    if (lang.includes("de") || timeZone.includes("Berlin")) {
      return COUNTRIES.find((c) => c.code === "DE") || COUNTRIES[0];
    }
    if (lang.includes("fr") || timeZone.includes("Paris")) {
      return COUNTRIES.find((c) => c.code === "FR") || COUNTRIES[0];
    }
    if (lang.includes("es") || timeZone.includes("Madrid")) {
      return COUNTRIES.find((c) => c.code === "ES") || COUNTRIES[0];
    }
    if (lang.includes("ja") || timeZone.includes("Tokyo")) {
      return COUNTRIES.find((c) => c.code === "JP") || COUNTRIES[0];
    }
    if (lang.includes("en-CA") || timeZone.includes("Toronto") || timeZone.includes("Vancouver")) {
      return COUNTRIES.find((c) => c.code === "CA") || COUNTRIES[0];
    }
  } catch (e) {
    // default
  }
  return COUNTRIES[0];
}

export function buildAmazonUrl(searchQuery: string, country: CountryConfig, gift?: { asin?: string }): string {
  const tag = withChannelSuffix(country.tag);
  if (gift?.asin && /^[A-Z0-9]{10}$/i.test(gift.asin)) {
    return `https://www.${country.amazonDomain}/dp/${gift.asin}?tag=${tag}`;
  }
  const query = encodeURIComponent(searchQuery);
  return `https://www.${country.amazonDomain}/s?k=${query}&tag=${tag}`;
}

export function buildAmazonCartUrl(gift: { asin?: string; amazonSearchQuery?: string; title?: string }, country: CountryConfig): string {
  const tag = withChannelSuffix(country.tag);
  if (gift.asin && /^[A-Z0-9]{10}$/i.test(gift.asin)) {
    return `https://www.${country.amazonDomain}/gp/aws/cart/add.html?ASIN.1=${gift.asin}&Quantity.1=1&tag=${tag}`;
  }
  const query = encodeURIComponent(gift.amazonSearchQuery || gift.title || "");
  return `https://www.${country.amazonDomain}/s?k=${query}&tag=${tag}&i=aps&ref=cart_add`;
}
