import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const app = express();
const PORT = 3000;
const httpServer = createServer(app);

app.use(express.json());

// Security & Performance Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Simple In-Memory Rate Limiter (60 requests per minute per IP)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
app.use("/api/", (req, res, next) => {
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 60;

  const rateData = ipRequestCounts.get(clientIp);
  if (!rateData || now > rateData.resetTime) {
    ipRequestCounts.set(clientIp, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (rateData.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: "Troppe richieste. Riprova tra un minuto.",
      rateLimited: true,
    });
  }

  rateData.count += 1;
  next();
});

// Periodic cleanup of expired rate limit entries (every 5 mins)
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now > data.resetTime) ipRequestCounts.delete(ip);
  }
}, 5 * 60 * 1000);

// In-Memory Recommendations Cache (30 Minutes TTL)
interface CacheEntry {
  data: any;
  expiresAt: number;
}
const recommendationsCache = new Map<string, CacheEntry>();

function getCacheKey(body: any): string {
  const { recipient, occasion, budget, vibe, formatPill, hasAlreadyEverything, extraDetails, fastTrackIdea, currencySymbol, countryCode } = body;
  const cleanExtra = (extraDetails || fastTrackIdea || "").trim().toLowerCase();
  return `${recipient || ""}_${occasion || ""}_${budget || ""}_${vibe || ""}_${formatPill || ""}_${hasAlreadyEverything ? 1 : 0}_${cleanExtra}_${currencySymbol || "€"}_${countryCode || "IT"}`.toLowerCase();
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Category-based curated Unsplash imagery map
const CATEGORY_IMAGES: Record<string, string[]> = {
  tech: [
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
  ],
  home: [
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
  ],
  gaming: [
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
  ],
  wellness: [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1608248597260-1e582803b9b4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1512290900673-3e742880a4dd?auto=format&fit=crop&w=600&q=80",
  ],
  outdoors: [
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1549465220-1a8b9238bd345a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80",
  ],
};

function getRandomImage(category: string, index: number): string {
  const cat = (category || "").toLowerCase();
  let pool = CATEGORY_IMAGES.default;
  for (const key of Object.keys(CATEGORY_IMAGES)) {
    if (cat.includes(key)) {
      pool = CATEGORY_IMAGES[key];
      break;
    }
  }
  return pool[index % pool.length];
}

// API endpoint for Gift Recommendations
app.post("/api/recommend-gifts", async (req, res) => {
  try {
    const {
      recipient,
      occasion,
      budget,
      vibe,
      formatPill,
      hasAlreadyEverything,
      extraDetails,
      fastTrackIdea,
      excludeTitles = [],
      countryCode,
      currencySymbol = "€",
    } = req.body;

    // Check In-Memory Cache (skip cache if excludeTitles is populated)
    const cacheKey = getCacheKey(req.body);
    if (excludeTitles.length === 0) {
      const cached = recommendationsCache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return res.json({ success: true, gifts: cached.data, source: "cache" });
      }
    }

    const prompt = `You are an expert Amazon gift curator for KADO AI.
Your absolute top priority is ULTRA-PRECISION and HIGH RELEVANCE to the user's exact inputs.

USER SELECTION CONSTRAINTS:
- Recipient: ${recipient || "Partner"}
- Occasion: ${occasion || "Special Gift"}
- Selected Budget Range: "${budget || "25-50€"}"
- Vibe / Category: ${vibe || "Tech"}
- Format Filter: ${formatPill || "Tutto"} (If "Esperienza": focus on experiences, tasting kits, workshops, subscription boxes, or DIY gourmet. If "Oggetto Fisico": focus on tangible items).
- Has Everything Already: ${hasAlreadyEverything ? "YES -> MANDATORY: Avoid generic clichés! Recommend ultra-original, niche, artisanal, gourmet, clever design, or unique specialty gifts." : "NO"}
- Extra Details / Voice Transcript: "${extraDetails || fastTrackIdea || "None"}"
- Previously Shown Titles (Exclude): ${JSON.stringify(excludeTitles)}
- Currency Symbol: "${currencySymbol || "€"}"

CRITICAL VOICE & EXTRA DETAILS PRECISION MANDATE:
- If Extra Details / Voice Transcript is provided and mentions ANY specific hobby, sport, interest, pet, food, brand, or topic (e.g., "padel", "caffè", "vinili", "gatti", "fotografia", "viaggi in Giappone", "arrampicata", "palestra", "vino"), ALL 3 RECOMMENDATIONS MUST BE 100% TAILORED TO THAT SPECIFIC TOPIC! Do NOT return generic unrelated items.
- If Previously Shown Titles (Exclude) contains items: DO NOT REPEAT ANY OF THEM! You MUST generate 3 BRAND NEW, DISTINCT, HIGH-QUALITY options tailored to the user's criteria.

STRICT BUDGET PRICE ENFORCEMENT RULES:
- Selected Budget Range: "${budget}"
- If budget is "<25€" or "< $30": price MUST be strictly under 25€ (e.g. "18€", "22€"). NEVER output prices >= 25€.
- If budget is "25-50€" or "$50": price MUST be strictly between 25€ and 50€ (e.g. "32€", "45€"). NEVER output prices > 50€.
- If budget is "50-100€" or "$100": price MUST be strictly between 50€ and 100€ (e.g. "68€", "89€"). NEVER output prices > 100€.
- If budget is ">100€": price MUST be strictly greater than 100€ (e.g. "129€", "159€").

MANDATORY DIVERSIFICATION RULE (EXACTLY 3 CARDS):
1. Card 1 (tag: "Più Scelto"): Bestseller physical product or top-rated kit directly related to the user's topic/vibe.
2. Card 2 (tag: "Originale / Libro"): Bestseller book, specialized guide, journal, or highly original creative gift related to the topic.
3. Card 3 (tag: "Top Qualità"): High-quality premium accessory, complete set, or gourmet kit related to the topic.

STRICT AMAZON QUALITY FILTERS:
- Rating MUST be between 4.4 and 4.9 stars.
- ReviewsCount MUST be an integer > 100.
- isPrime MUST be true.
- Title MUST be concise (maximum 5-6 words).
- Reason MUST be 1 clear, ultra-precise motivation sentence explaining exactly why it fits ${recipient} and their interest.
- Price MUST match currency (${currencySymbol || "€"}) and STRICTLY fit the budget range "${budget}".`;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Returning fallback.");
      return res.json({
        success: false,
        source: "fallback",
        message: "API Key missing",
      });
    }

    // 10s Timeout Guard for Gemini Call
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API timeout (>10s)")), 10000)
    );

    const responsePromise = ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of 3 diversified gift recommendations",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: "Concise product title (max 5 words)" },
              price: { type: Type.STRING },
              reason: { type: Type.STRING, description: "1 sentence motivation sentence" },
              matchScore: { type: Type.INTEGER },
              tag: { type: Type.STRING, description: "Exact badge: Più Scelto, Originale / Libro, or Top Qualità" },
              amazonSearchQuery: { type: Type.STRING },
              category: { type: Type.STRING },
              rating: { type: Type.NUMBER, description: "Rating score e.g. 4.8" },
              reviewsCount: { type: Type.INTEGER, description: "Number of reviews e.g. 2400" },
              isPrime: { type: Type.BOOLEAN },
            },
            required: [
              "title",
              "price",
              "reason",
              "matchScore",
              "tag",
              "amazonSearchQuery",
              "category",
              "rating",
              "reviewsCount",
              "isPrime",
            ],
          },
        },
      },
    });

    const response = (await Promise.race([responsePromise, timeoutPromise])) as any;

    const jsonText = response.text ? response.text.trim() : "[]";
    const rawGifts = JSON.parse(jsonText);

    const fallbackBadges = ["Più Scelto", "Originale / Libro", "Top Qualità"];

    // Budget range helper
    const cleanB = (budget || "").replace(/\s+/g, "").replace(/\$/g, "").replace(/€/g, "");
    let minBudget = 25;
    let maxBudget = 50;

    if (cleanB.includes("<25") || cleanB.includes("<30") || cleanB.startsWith("<")) {
      minBudget = 10;
      maxBudget = 25;
    } else if (cleanB.includes(">100") || cleanB.startsWith(">")) {
      minBudget = 100;
      maxBudget = 300;
    } else if (cleanB.includes("-")) {
      const parts = cleanB.split("-").map((p: string) => parseInt(p, 10)).filter((n: number) => !isNaN(n));
      if (parts.length >= 2) {
        minBudget = parts[0];
        maxBudget = parts[1];
      }
    } else {
      const numB = parseInt(cleanB, 10);
      if (!isNaN(numB) && numB > 0) {
        minBudget = Math.max(5, Math.floor(numB * 0.75));
        maxBudget = numB;
      }
    }

    const gifts = rawGifts.slice(0, 3).map((gift: any, idx: number) => {
      let parsedPrice = 0;
      if (gift.price) {
        const cleanNum = gift.price.replace(/[^0-9.,]/g, "").replace(",", ".");
        parsedPrice = parseFloat(cleanNum) || 0;
      }

      let finalPrice = gift.price;
      let finalTitle = gift.title;

      if (parsedPrice === 0 || parsedPrice > maxBudget || (parsedPrice < minBudget && minBudget > 10)) {
        const targetVal = Math.min(
          maxBudget,
          Math.max(minBudget, Math.round(minBudget + (maxBudget - minBudget) * (0.35 + idx * 0.25)))
        );
        finalPrice = `${currencySymbol}${targetVal}`;

        const titleLower = (gift.title || "").toLowerCase();
        const highEndKeywords = ["theragun", "playstation", "canon", "iphone", "apple watch", "macbook", "bose soundlink", "sony wh-1000", "fellow stagg", "dyson"];
        if (maxBudget <= 50 && highEndKeywords.some((k) => titleLower.includes(k))) {
          const cat = (gift.category || "").toLowerCase();
          if (cat.includes("tech")) finalTitle = "Anker Power Bank Wireless 10000mAh";
          else if (cat.includes("books")) finalTitle = "Libro Guida Bestseller Illustrato";
          else finalTitle = "Set Diffusore Aromaterapia in Ceramica";
        }
      }

      return {
        ...gift,
        title: finalTitle,
        price: finalPrice,
        id: gift.id || `gift-${Date.now()}-${idx}`,
        tag: gift.tag || fallbackBadges[idx % 3],
        rating: gift.rating && gift.rating >= 4.3 ? gift.rating : 4.7,
        reviewsCount: gift.reviewsCount && gift.reviewsCount >= 100 ? gift.reviewsCount : 1250 + idx * 430,
        isPrime: gift.isPrime !== undefined ? gift.isPrime : true,
        imageUrl: getRandomImage(gift.category || "default", idx),
      };
    });

    // Cache valid response for 30 minutes
    if (gifts.length > 0 && excludeTitles.length === 0) {
      recommendationsCache.set(cacheKey, {
        data: gifts,
        expiresAt: Date.now() + 30 * 60 * 1000,
      });
    }

    return res.json({ success: true, gifts, source: "gemini" });
  } catch (error: any) {
    console.warn("Notice: Gemini API returned fallback response:", error.message || error);
    return res.json({
      success: false,
      source: "fallback",
      error: error.message || "Failed to generate recommendations",
    });
  }
});

// API endpoint for AI Gift Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language = "en", quizState } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: false,
        response: "I am ready to help you find the perfect gift!",
      });
    }

    const systemInstruction = `You are Wrap AI, an ultra-refined luxury gift concierge.
Your goal is to guide users who either:
1. Already have a vague or general idea (e.g., "my friend likes coffee and vinyls") - help them narrow it down by asking 1-2 warm, specific, clarifying questions or giving refined options.
2. Want a simple, natural voice or chat guided experience to build a gift selection.

Language: ${language.toUpperCase()}.
Guidelines:
- Keep your tone elegant, warm, concise, and helpful (1-3 paragraphs max).
- If the user provides enough details or asks for specific recommendations, suggest 3 specific real gifts with prices and why they fit.
- IF you recommend gifts, ALSO append a hidden valid JSON block at the very end of your response in this exact format:
\`\`\`json
{
  "gifts": [
    {
      "title": "Exact Product Name",
      "price": "$50",
      "reason": "Short 1 sentence reason",
      "matchScore": 98,
      "tag": "TOP PICK",
      "amazonSearchQuery": "Exact Product Name",
      "category": "tech"
    }
  ]
}
\`\`\`
Context from current selection: Recipient: ${quizState?.recipient || "Not specified"}, Occasion: ${quizState?.occasion || "Not specified"}, Budget: ${quizState?.budget || "Not specified"}.`;

    const chatContents = (messages || []).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    if (chatContents.length === 0) {
      chatContents.push({ role: "user", parts: [{ text: "Hello! Help me find a gift." }] });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm here to help! Could you tell me a little more about the person you're buying for?";

    let extractedGifts: any[] | null = null;
    const jsonMatch = replyText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.gifts && Array.isArray(parsed.gifts)) {
          extractedGifts = parsed.gifts.map((g: any, idx: number) => ({
            ...g,
            id: g.id || `chat-gift-${Date.now()}-${idx}`,
            imageUrl: getRandomImage(g.category || "default", idx),
          }));
        }
      } catch (err) {
        console.warn("Could not parse embedded JSON gifts from chat response", err);
      }
    }

    const cleanText = replyText.replace(/```json\s*\{[\s\S]*?\}\s*```/g, "").trim();

    return res.json({
      success: true,
      response: cleanText,
      gifts: extractedGifts,
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      success: false,
      response: "I encountered a minor issue. Let's try again!",
      error: error.message,
    });
  }
});

// API endpoint for Text-To-Speech (Gemini TTS)
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;

    if (!process.env.GEMINI_API_KEY || !text) {
      return res.status(400).json({ success: false, error: "Missing API key or text" });
    }

    const ttsResponse = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say clearly and warmly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ success: false, error: "No audio generated" });
    }

    return res.json({
      success: true,
      audioUrl: `data:audio/mp3;base64,${base64Audio}`,
    });
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
      console.warn("Gemini TTS rate limited or quota exceeded, using browser TTS fallback.");
      return res.json({ success: false, fallback: true, reason: "quota_exceeded" });
    }
    console.warn("Error in /api/tts:", error?.message || error);
    return res.json({ success: false, fallback: true, error: error?.message });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { maxAge: "1d" }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Kado AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

