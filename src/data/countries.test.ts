// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { buildAmazonUrl, buildAmazonCartUrl } from "./countries";
import type { CountryConfig } from "../types";

const IT_COUNTRY: CountryConfig = {
  code: "IT",
  name: "Italia",
  flag: "🇮🇹",
  amazonDomain: "amazon.it",
  currency: "EUR",
  symbol: "€",
  tag: "test-tag-21",
};

beforeEach(() => {
  localStorage.clear();
});

describe("buildAmazonUrl", () => {
  it("links straight to the product page when a real ASIN is present", () => {
    // This is the path real Amazon data (PA-API, once active) flows
    // through. Without a valid ASIN the user never lands on the exact
    // product — see the search-fallback test below — so this exact
    // path is the one that makes the "we found THIS gift" promise true.
    const url = buildAmazonUrl("ignored when ASIN is present", IT_COUNTRY, { asin: "B08N5WRWNW" });
    expect(url).toBe("https://www.amazon.it/dp/B08N5WRWNW?tag=test-tag-21");
  });

  it("falls back to a search link when no valid ASIN is available", () => {
    // This is the path every AI-only (Gemini-estimated) gift takes
    // today: Amazon shows a results page, not the specific product.
    // Documented here on purpose so nobody "fixes" this file without
    // realizing it's the documented current behavior, not a bug to
    // silently patch — see the PA-API integration for the real fix.
    const url = buildAmazonUrl("Overgrip Padel Professionale Kit", IT_COUNTRY);
    expect(url).toBe("https://www.amazon.it/s?k=Overgrip%20Padel%20Professionale%20Kit&tag=test-tag-21");
  });

  it("rejects a malformed ASIN and falls back to search", () => {
    const url = buildAmazonUrl("fallback query", IT_COUNTRY, { asin: "not-a-real-asin" });
    expect(url).toContain("/s?k=");
  });
});

describe("buildAmazonCartUrl", () => {
  it("uses the real add-to-cart endpoint when a real ASIN is present", () => {
    const url = buildAmazonCartUrl({ asin: "B08N5WRWNW" }, IT_COUNTRY);
    expect(url).toBe("https://www.amazon.it/gp/aws/cart/add.html?ASIN.1=B08N5WRWNW&Quantity.1=1&tag=test-tag-21");
  });

  it("falls back to a search link (not a real cart add) without a real ASIN", () => {
    const url = buildAmazonCartUrl({ amazonSearchQuery: "Anker Mini Power Bank 5000mAh" }, IT_COUNTRY);
    expect(url).toContain("/s?k=");
    expect(url).not.toContain("/gp/aws/cart/add.html");
  });
});
