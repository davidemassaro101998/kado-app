// Amazon Product Advertising API 5.0 client — server-side only.
//
// Gated entirely behind AMAZON_PAAPI_ACCESS_KEY / AMAZON_PAAPI_SECRET_KEY.
// Until Amazon grants access (requires an approved Associates account with
// qualifying sales — see https://webservices.amazon.com/paapi5/documentation/),
// isPaapiConfigured() is false and searchAmazonProduct() always resolves to
// null with zero network calls: the app keeps working exactly as it does
// today, on Gemini-generated ideas + Amazon search links. Once both env
// vars are set, real product lookups (ASIN, live price, real rating/review
// count, real image) activate automatically — no other code path changes.
//
// Marketplace host/region pairs below are Amazon's documented PA-API 5.0
// endpoints; double-check against current PA-API docs when wiring in real
// keys, since Amazon does occasionally add/change marketplaces.
import crypto from "crypto";

interface MarketplaceConfig {
  host: string;
  region: string;
  marketplace: string;
}

const MARKETPLACES: Record<string, MarketplaceConfig> = {
  US: { host: "webservices.amazon.com", region: "us-east-1", marketplace: "www.amazon.com" },
  UK: { host: "webservices.amazon.co.uk", region: "eu-west-1", marketplace: "www.amazon.co.uk" },
  DE: { host: "webservices.amazon.de", region: "eu-west-1", marketplace: "www.amazon.de" },
  FR: { host: "webservices.amazon.fr", region: "eu-west-1", marketplace: "www.amazon.fr" },
  ES: { host: "webservices.amazon.es", region: "eu-west-1", marketplace: "www.amazon.es" },
  IT: { host: "webservices.amazon.it", region: "eu-west-1", marketplace: "www.amazon.it" },
  CA: { host: "webservices.amazon.ca", region: "us-east-1", marketplace: "www.amazon.ca" },
  JP: { host: "webservices.amazon.co.jp", region: "us-west-2", marketplace: "www.amazon.co.jp" },
};

export interface PaapiProduct {
  asin: string;
  title: string;
  price?: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  isPrime?: boolean;
  detailPageUrl?: string;
}

export function isPaapiConfigured(): boolean {
  return !!(process.env.AMAZON_PAAPI_ACCESS_KEY && process.env.AMAZON_PAAPI_SECRET_KEY);
}

function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

// AWS Signature Version 4 — every PA-API 5.0 request must carry one.
function signRequest(opts: {
  host: string;
  path: string;
  region: string;
  payload: string;
  target: string;
  accessKey: string;
  secretKey: string;
}): Record<string, string> {
  const { host, path, region, payload, target, accessKey, secretKey } = opts;
  const service = "ProductAdvertisingAPI";
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const canonicalHeaders =
    `content-encoding:amz-1.0\n` +
    `content-type:application/json; charset=utf-8\n` +
    `host:${host}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${target}\n`;
  const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";
  const canonicalRequest = ["POST", path, "", canonicalHeaders, signedHeaders, sha256Hex(payload)].join("\n");

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256Hex(canonicalRequest)].join("\n");

  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = hmac(kSigning, stringToSign).toString("hex");

  return {
    "content-encoding": "amz-1.0",
    "content-type": "application/json; charset=utf-8",
    host,
    "x-amz-date": amzDate,
    "x-amz-target": target,
    authorization:
      `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

// Looks up the single best real match for a search query. Never throws —
// returns null on missing config, an unsupported marketplace, a network
// error, or zero results — so callers can always fall back to the
// AI-generated gift data without special-casing PA-API failures.
export async function searchAmazonProduct(
  query: string,
  countryCode: string,
  partnerTag: string
): Promise<PaapiProduct | null> {
  if (!isPaapiConfigured() || !query || !partnerTag) return null;

  const marketplace = MARKETPLACES[countryCode];
  if (!marketplace) return null;

  const accessKey = process.env.AMAZON_PAAPI_ACCESS_KEY!;
  const secretKey = process.env.AMAZON_PAAPI_SECRET_KEY!;
  const path = "/paapi5/searchitems";
  const target = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";
  const payload = JSON.stringify({
    Keywords: query,
    SearchIndex: "All",
    ItemCount: 1,
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: marketplace.marketplace,
    Resources: [
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Images.Primary.Large",
      "CustomerReviews.Count",
      "CustomerReviews.StarRating",
      "Offers.Listings.DeliveryInfo.IsPrimeEligible",
    ],
  });

  try {
    const headers = signRequest({
      host: marketplace.host,
      path,
      region: marketplace.region,
      payload,
      target,
      accessKey,
      secretKey,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`https://${marketplace.host}${path}`, {
      method: "POST",
      headers,
      body: payload,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`PA-API request failed (${response.status}) for query "${query}"`);
      return null;
    }

    const data: any = await response.json();
    const item = data?.SearchResult?.Items?.[0];
    if (!item?.ASIN) return null;

    return {
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || query,
      price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount,
      imageUrl: item.Images?.Primary?.Large?.URL,
      rating: item.CustomerReviews?.StarRating?.Value,
      reviewsCount: item.CustomerReviews?.Count,
      isPrime: item.Offers?.Listings?.[0]?.DeliveryInfo?.IsPrimeEligible,
      detailPageUrl: item.DetailPageURL,
    };
  } catch (err) {
    console.warn(`PA-API lookup error for query "${query}":`, (err as Error)?.message || err);
    return null;
  }
}
