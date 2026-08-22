import { CountryConfig } from "../types";
import { withChannelSuffix } from "../lib/channel";

export const COUNTRIES: CountryConfig[] = [
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    amazonDomain: "amazon.com",
    currency: "USD",
    symbol: "$",
    tag: "giftai-20",
  },
  {
    code: "IT",
    name: "Italia",
    flag: "🇮🇹",
    amazonDomain: "amazon.it",
    currency: "EUR",
    symbol: "€",
    tag: "giftai0f-21",
  },
  {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    amazonDomain: "amazon.co.uk",
    currency: "GBP",
    symbol: "£",
    tag: "giftaiuk-21",
  },
  {
    code: "DE",
    name: "Deutschland",
    flag: "🇩🇪",
    amazonDomain: "amazon.de",
    currency: "EUR",
    symbol: "€",
    tag: "giftaide-21",
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    amazonDomain: "amazon.fr",
    currency: "EUR",
    symbol: "€",
    tag: "giftaifr-21",
  },
  {
    code: "ES",
    name: "España",
    flag: "🇪🇸",
    amazonDomain: "amazon.es",
    currency: "EUR",
    symbol: "€",
    tag: "giftaies-21",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    amazonDomain: "amazon.ca",
    currency: "CAD",
    symbol: "CA$",
    tag: "giftaica-20",
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    amazonDomain: "amazon.co.jp",
    currency: "JPY",
    symbol: "¥",
    tag: "giftaijp-22",
  },
  // --- Added for wider global coverage. IMPORTANT: every "tag" below is a
  // PLACEHOLDER, not a working Amazon Associates ID -- Amazon will still
  // resolve these links (no error for the visitor), but no commission is
  // credited on a tag that was never actually created in the Associates
  // panel for that marketplace. Create a real Tracking ID for each country
  // in https://affiliate-program.amazon.<domain>/ before relying on it.
  // (Also worth fixing at the same time: the 8 tags above are literally
  // identical across Kado/Bricolo/Forma, so Amazon can't currently tell
  // which app is driving which sale -- each app should get its own set.)
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    amazonDomain: "amazon.com.au",
    currency: "AUD",
    symbol: "A$",
    tag: "TODO-kado-au-21",
  },
  {
    code: "NL",
    name: "Nederland",
    flag: "🇳🇱",
    amazonDomain: "amazon.nl",
    currency: "EUR",
    symbol: "€",
    tag: "TODO-kado-nl-21",
  },
  {
    code: "MX",
    name: "México",
    flag: "🇲🇽",
    amazonDomain: "amazon.com.mx",
    currency: "MXN",
    symbol: "$",
    tag: "TODO-kado-mx-21",
  },
  {
    code: "BR",
    name: "Brasil",
    flag: "🇧🇷",
    amazonDomain: "amazon.com.br",
    currency: "BRL",
    symbol: "R$",
    tag: "TODO-kado-br-21",
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    amazonDomain: "amazon.in",
    currency: "INR",
    symbol: "₹",
    tag: "TODO-kado-in-21",
  },
  {
    code: "SE",
    name: "Sverige",
    flag: "🇸🇪",
    amazonDomain: "amazon.se",
    currency: "SEK",
    symbol: "kr",
    tag: "TODO-kado-se-21",
  },
  {
    code: "PL",
    name: "Polska",
    flag: "🇵🇱",
    amazonDomain: "amazon.pl",
    currency: "PLN",
    symbol: "zł",
    tag: "TODO-kado-pl-21",
  },
  {
    code: "BE",
    name: "België",
    flag: "🇧🇪",
    amazonDomain: "amazon.com.be",
    currency: "EUR",
    symbol: "€",
    tag: "TODO-kado-be-21",
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    amazonDomain: "amazon.sg",
    currency: "SGD",
    symbol: "S$",
    tag: "TODO-kado-sg-21",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    amazonDomain: "amazon.ae",
    currency: "AED",
    symbol: "د.إ",
    tag: "TODO-kado-ae-21",
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
    if (lang.includes("en-AU") || timeZone.includes("Australia")) {
      return COUNTRIES.find((c) => c.code === "AU") || COUNTRIES[0];
    }
    if (lang.includes("nl") || timeZone.includes("Amsterdam")) {
      return COUNTRIES.find((c) => c.code === "NL") || COUNTRIES[0];
    }
    if (lang.includes("es-MX") || timeZone.includes("Mexico_City")) {
      return COUNTRIES.find((c) => c.code === "MX") || COUNTRIES[0];
    }
    if (lang.includes("pt-BR") || timeZone.includes("Sao_Paulo")) {
      return COUNTRIES.find((c) => c.code === "BR") || COUNTRIES[0];
    }
    if (lang.includes("hi") || lang.includes("en-IN") || timeZone.includes("Kolkata") || timeZone.includes("Calcutta")) {
      return COUNTRIES.find((c) => c.code === "IN") || COUNTRIES[0];
    }
    if (lang.includes("sv") || timeZone.includes("Stockholm")) {
      return COUNTRIES.find((c) => c.code === "SE") || COUNTRIES[0];
    }
    if (lang.includes("pl") || timeZone.includes("Warsaw")) {
      return COUNTRIES.find((c) => c.code === "PL") || COUNTRIES[0];
    }
    if (lang.includes("nl-BE") || lang.includes("fr-BE") || timeZone.includes("Brussels")) {
      return COUNTRIES.find((c) => c.code === "BE") || COUNTRIES[0];
    }
    if (lang.includes("en-SG") || timeZone.includes("Singapore")) {
      return COUNTRIES.find((c) => c.code === "SG") || COUNTRIES[0];
    }
    if (lang.includes("ar-AE") || timeZone.includes("Dubai")) {
      return COUNTRIES.find((c) => c.code === "AE") || COUNTRIES[0];
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
