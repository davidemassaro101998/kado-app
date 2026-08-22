import { GiftItem, QuizState, CountryConfig } from "../types";
import { Language } from "./translations";

export interface BudgetRange {
  min: number;
  max: number;
  label: string;
}

export function parseBudgetRange(budgetRaw: string): BudgetRange {
  if (!budgetRaw) {
    return { min: 25, max: 50, label: "25-50€" };
  }

  const clean = budgetRaw.replace(/\s+/g, "").replace(/\$/g, "").replace(/€/g, "");

  // Check for <25 or <30
  if (clean.includes("<25") || clean.includes("<30") || clean.startsWith("<")) {
    const val = parseInt(clean.replace("<", ""), 10) || 25;
    return { min: 10, max: Math.min(val, 25), label: `<${val}€` };
  }

  // Check for >100
  if (clean.includes(">100") || clean.startsWith(">")) {
    return { min: 100, max: 300, label: ">100€" };
  }

  // Check for range like 25-50 or 50-100
  if (clean.includes("-")) {
    const parts = clean.split("-").map((p) => parseInt(p, 10)).filter((n) => !isNaN(n));
    if (parts.length >= 2) {
      return { min: parts[0], max: parts[1], label: `${parts[0]}-${parts[1]}€` };
    }
  }

  // Exact custom number (e.g. "18", "35", "150")
  const num = parseInt(clean, 10);
  if (!isNaN(num) && num > 0) {
    const minVal = Math.max(5, Math.floor(num * 0.75));
    return { min: minVal, max: num, label: `${num}€` };
  }

  // Fallback default
  return { min: 25, max: 50, label: "25-50€" };
}

export function generateSmartFallbackGifts(
  quiz: QuizState,
  country: CountryConfig,
  language: Language = "it"
): GiftItem[] {
  const sym = country.symbol || "€";
  const budgetRange = parseBudgetRange(quiz.budget);
  const t = (it: string, en: string) => (language === "it" ? it : en);

  // Helper to get realistic price strictly inside budgetRange
  const getPrice = (fraction: number) => {
    const val = Math.round(budgetRange.min + (budgetRange.max - budgetRange.min) * fraction);
    const finalVal = Math.min(val, budgetRange.max);
    return `${sym}${finalVal}`;
  };

  const recipient = quiz.recipient || t("Partner", "Partner");
  const vibeLower = (quiz.vibe || "").toLowerCase();
  const extraLower = (quiz.extraDetails || "").toLowerCase();
  const combinedText = `${vibeLower} ${extraLower}`;

  // Topic specific overrides
  if (combinedText.includes("padel") || combinedText.includes("tennis")) {
    return [
      {
        id: `ideeregalo-${Date.now()}-0`,
        title: t("Grip Professionale Padel & Protezione Bacchetta Set", "Professional Padel Grip & Racket Protection Set"),
        price: getPrice(0.4),
        reason: t(
          `Kit indispensabile per migliorare la presa e le prestazioni in campo.`,
          `Essential kit to improve your grip and on-court performance.`
        ),
        matchScore: 99,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "Overgrip Padel Professionale Kit",
        category: "outdoors",
        imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 1420,
        isPrime: true,
      },
      {
        id: `ideeregalo-${Date.now()}-1`,
        title: t("Libro Bestseller 'Padel: Tattiche Vincenti e Mental Game'", "Bestseller Book 'Padel: Winning Tactics and Mental Game'"),
        price: getPrice(0.3),
        reason: t(
          `Guida tattica per perfezionare la strategia di gioco per ${recipient}.`,
          `Tactical guide to sharpen ${recipient}'s game strategy.`
        ),
        matchScore: 97,
        tag: t("Originale / Libro", "Original / Book"),
        amazonSearchQuery: "Libro Tattica Padel Bestseller",
        category: "books",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        reviewsCount: 890,
        isPrime: true,
      },
      {
        id: `ideeregalo-${Date.now()}-2`,
        title: t("Tubo Pressurizzatore Palle Padel di Precisione", "Precision Padel Ball Pressurizer Tube"),
        price: getPrice(0.7),
        reason: t(
          `Mantiene la pressione ottimale delle palline, ideale per ogni partita.`,
          `Keeps balls at optimal pressure, perfect for every match.`
        ),
        matchScore: 98,
        tag: t("Top Qualità", "Top Quality"),
        amazonSearchQuery: "Pressurizzatore Palline Padel",
        category: "outdoors",
        imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 2100,
        isPrime: true,
      },
    ];
  }

  if (combinedText.includes("caffè") || combinedText.includes("caffe") || combinedText.includes("coffee")) {
    return [
      {
        id: `ideeregalo-${Date.now()}-0`,
        title: t("Macinacaffè Manuale in Acciaio con Macine Ceramiche", "Manual Steel Coffee Grinder with Ceramic Burrs"),
        price: getPrice(0.5),
        reason: t(
          `Per macinare chicchi freschi al momento e sprigionare aromi unici.`,
          `Grinds fresh beans on the spot to release unique aromas.`
        ),
        matchScore: 99,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "Macinacaffè Manuale Ceramica Acciaio",
        category: "home",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 3120,
        isPrime: true,
      },
      {
        id: `ideeregalo-${Date.now()}-1`,
        title: t("Libro Bestseller 'Dalla Pianta alla Tazzina: Il Mondo del Caffè'", "Bestseller Book 'From Plant to Cup: The World of Coffee'"),
        price: getPrice(0.35),
        reason: t(
          `Un viaggio illustrato affascinante tra miscele, estrazioni e degustazioni.`,
          `A fascinating illustrated journey through blends, brewing and tasting.`
        ),
        matchScore: 98,
        tag: t("Originale / Libro", "Original / Book"),
        amazonSearchQuery: "Libro Mondo del Caffè Bestseller",
        category: "books",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 1240,
        isPrime: true,
      },
      {
        id: `ideeregalo-${Date.now()}-2`,
        title: t("Set Degustazione Caffè Monorigine Specialty in Grani", "Single-Origin Specialty Whole Bean Coffee Tasting Set"),
        price: getPrice(0.75),
        reason: t(
          `Selezione gourmet di arabica pregiate confezionate in scatola regalo.`,
          `Gourmet selection of premium arabica beans in a gift box.`
        ),
        matchScore: 97,
        tag: t("Top Qualità", "Top Quality"),
        amazonSearchQuery: "Caffè Monorigine Specialty Set Regalo",
        category: "home",
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        reviewsCount: 1850,
        isPrime: true,
      },
    ];
  }

  const isRelaxVibe = vibeLower.includes("relax") || vibeLower.includes("cozy") || vibeLower.includes("casa") || vibeLower.includes("home") || vibeLower.includes("wellness");
  const isTravelVibe = vibeLower.includes("viaggi") || vibeLower.includes("travel") || vibeLower.includes("outdoors");

  // Tier 1: Budget under 25€ (e.g., <25€)
  if (budgetRange.max <= 25) {
    let card1: Omit<GiftItem, "id"> = {
      title: "Anker Mini Power Bank Magnetico 5000mAh",
      price: getPrice(0.75), // ~19€
      reason: t(
        `Caricabatterie tascabile super compatto e veloce, ideale per ${recipient}.`,
        `Super compact, fast-charging pocket power bank, perfect for ${recipient}.`
      ),
      matchScore: 98,
      tag: t("Più Scelto", "Top Pick"),
      amazonSearchQuery: "Anker Mini Power Bank 5000mAh",
      category: "tech",
      imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviewsCount: 3890,
      isPrime: true,
    };

    if (isRelaxVibe) {
      card1 = {
        title: t("Tazza Termica Inox da Viaggio con Chiusura Ermetica", "Stainless Steel Travel Thermal Mug with Airtight Seal"),
        price: getPrice(0.8), // ~20€
        reason: t(
          `Mantiene caffe e tisane calde per 8 ore, perfetta per il relax quotidiano.`,
          `Keeps coffee and tea hot for 8 hours, perfect for everyday relaxation.`
        ),
        matchScore: 97,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "Tazza Termica Inox Caffè da Viaggio",
        category: "home",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 2450,
        isPrime: true,
      };
    }

    const card2: Omit<GiftItem, "id"> = {
      title: t("Libro Guida Bestseller 'Piccolo Libro della Mindfulness'", "Bestseller Guide 'The Little Book of Mindfulness'"),
      price: getPrice(0.4), // ~15€
      reason: t(
        `Un bestseller tascabile ricco di spunti e consigli pratici per ogni giorno.`,
        `A pocket-sized bestseller full of everyday tips and inspiration.`
      ),
      matchScore: 96,
      tag: t("Originale / Libro", "Original / Book"),
      amazonSearchQuery: "Piccolo Libro della Mindfulness Bestseller",
      category: "books",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 1890,
      isPrime: true,
    };

    const card3: Omit<GiftItem, "id"> = {
      title: t("Set Infusi Biologici Gourmet in Scatola di Latta Design", "Gourmet Organic Herbal Tea Set in a Designer Tin Box"),
      price: getPrice(0.85), // ~21€
      reason: t(
        `Selezione di tisane pregiate in elegante confezione regalo per ${recipient}.`,
        `A selection of premium herbal teas in an elegant gift box for ${recipient}.`
      ),
      matchScore: 97,
      tag: t("Top Qualità", "Top Quality"),
      amazonSearchQuery: "Set Tisane Biologiche Scatola Regalo Latta",
      category: "wellness",
      imageUrl: "https://images.unsplash.com/photo-1512290900673-3e742880a4dd?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviewsCount: 1560,
      isPrime: true,
    };

    return [card1, card2, card3].map((item, index) => ({
      ...item,
      id: `ideeregalo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    }));
  }

  // Tier 2: Budget 25 - 50€
  if (budgetRange.max <= 50) {
    let card1: Omit<GiftItem, "id"> = {
      title: "Anker MagGo Power Bank Wireless Magnético 10000mAh",
      price: getPrice(0.55), // ~39€
      reason: t(
        `Ricarica rapida magnetica tascabile. Il bestseller più scelto per gli amanti del tech.`,
        `Fast magnetic pocket charging. The top pick for tech lovers.`
      ),
      matchScore: 98,
      tag: t("Più Scelto", "Top Pick"),
      amazonSearchQuery: "Anker MagGo Wireless Power Bank 10000mAh",
      category: "tech",
      imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviewsCount: 2890,
      isPrime: true,
    };

    if (isRelaxVibe) {
      card1 = {
        title: t("Massaggiatore Cervicale Portatile a Calore Infrarossi", "Portable Infrared Heat Neck Massager"),
        price: getPrice(0.7), // ~42€
        reason: t(
          `Sollievo immediato per collo e spalle, perfetto per il relax di ${recipient}.`,
          `Instant relief for neck and shoulders, perfect for ${recipient}'s relaxation.`
        ),
        matchScore: 98,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "Massaggiatore Cervicale Portatile Calore",
        category: "wellness",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 2150,
        isPrime: true,
      };
    } else if (isTravelVibe) {
      card1 = {
        title: t("Cassa Bluetooth Impermeabile Portatile JBL GO 3", "JBL GO 3 Portable Waterproof Bluetooth Speaker"),
        price: getPrice(0.5), // ~38€
        reason: t(
          `Suono potente e robusto per qualsiasi viaggio o avventura all'aperto.`,
          `Powerful, rugged sound for any trip or outdoor adventure.`
        ),
        matchScore: 97,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "JBL GO 3 Cassa Bluetooth Impermeabile",
        category: "outdoors",
        imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 5120,
        isPrime: true,
      };
    }

    const card2: Omit<GiftItem, "id"> = {
      title: t("Libro Bestseller 'La Scienza della Cucina e del Caffè'", "Bestseller Book 'The Science of Cooking and Coffee'"),
      price: getPrice(0.2), // ~30€
      reason: t(
        `Guida illustrata per scoprire i segreti della gastronomia d'autore e del caffè.`,
        `Illustrated guide to discover the secrets of fine cuisine and coffee.`
      ),
      matchScore: 96,
      tag: t("Originale / Libro", "Original / Book"),
      amazonSearchQuery: "La Scienza della Cucina Libro Illustrato Bestseller",
      category: "books",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 1540,
      isPrime: true,
    };

    const card3: Omit<GiftItem, "id"> = {
      title: t("Set Diffusore Aromaterapia in Ceramica & Olio Essenziale", "Ceramic Aromatherapy Diffuser & Essential Oil Set"),
      price: getPrice(0.4), // ~35€
      reason: t(
        `Kit ambiente elegante con diffusore ad ultrasuoni per creare l'atmosfera perfetta.`,
        `Elegant ambiance kit with ultrasonic diffuser to create the perfect mood.`
      ),
      matchScore: 97,
      tag: t("Top Qualità", "Top Quality"),
      amazonSearchQuery: "Aromatherapy Ceramic Essential Oil Diffuser Set",
      category: "wellness",
      imageUrl: "https://images.unsplash.com/photo-1608248597260-1e582803b9b4?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviewsCount: 1820,
      isPrime: true,
    };

    return [card1, card2, card3].map((item, index) => ({
      ...item,
      id: `ideeregalo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    }));
  }

  // Tier 3: Budget 50 - 100€
  if (budgetRange.max <= 100) {
    const card1: Omit<GiftItem, "id"> = {
      title: "Ember Temperature Control Smart Mug Mini 2",
      price: getPrice(0.75), // ~88€
      reason: t(
        `Mantiene la bevanda alla temperatura preferita per ore. Il bestseller più amato per ${recipient}.`,
        `Keeps drinks at the perfect temperature for hours. The most-loved bestseller for ${recipient}.`
      ),
      matchScore: 99,
      tag: t("Più Scelto", "Top Pick"),
      amazonSearchQuery: "Ember Temperature Control Smart Mug 2",
      category: "tech",
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 3420,
      isPrime: true,
    };

    const card2: Omit<GiftItem, "id"> = {
      title: t(`Kindle Paperwhite Display 6.8" Luce Calda Regolabile`, `Kindle Paperwhite 6.8" Display with Adjustable Warm Light`),
      price: getPrice(0.78), // ~89€
      reason: t(
        `Lettura immersiva senza riflessi come su carta. Il regalo ideale per chi ama leggere.`,
        `Immersive, glare-free reading that feels like paper. The perfect gift for book lovers.`
      ),
      matchScore: 99,
      tag: t("Originale / Libro", "Original / Book"),
      amazonSearchQuery: "Kindle Paperwhite 16GB Adjustable Warm Light",
      category: "books",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      reviewsCount: 8400,
      isPrime: true,
    };

    const card3: Omit<GiftItem, "id"> = {
      title: "Fujifilm Instax Mini 12 Kit Fotocamera Istantanea",
      price: getPrice(0.75), // ~88€
      reason: t(
        `Kit completo per stampare ricordi istantanei in formato foto carta di credito.`,
        `Complete kit for printing instant memories in credit-card-sized prints.`
      ),
      matchScore: 97,
      tag: t("Top Qualità", "Top Quality"),
      amazonSearchQuery: "Fujifilm Instax Mini 12 Instant Camera Kit",
      category: "creative",
      imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 3100,
      isPrime: true,
    };

    return [card1, card2, card3].map((item, index) => ({
      ...item,
      id: `ideeregalo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    }));
  }

  // Tier 4: Budget > 100€
  const card1: Omit<GiftItem, "id"> = {
    title: t("Theragun Mini Massaggiatore Muscolare Portatile", "Theragun Mini Portable Muscle Massager"),
    price: getPrice(0.25), // ~149€
    reason: t(
      `Sollievo muscolare profondo e compatto per il benessere quotidiano di ${recipient}.`,
      `Deep, compact muscle relief for ${recipient}'s everyday wellbeing.`
    ),
    matchScore: 99,
    tag: t("Più Scelto", "Top Pick"),
    amazonSearchQuery: "Theragun Mini Massager Deep Tissue",
    category: "wellness",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 1950,
    isPrime: true,
  };

  const card2: Omit<GiftItem, "id"> = {
    title: t("Collezione di Volumi Rilegati di Design e Architettura di Lusso", "Hardcover Luxury Design & Architecture Coffee Table Book Collection"),
    price: getPrice(0.12), // ~125€
    reason: t(
      `Elegante volume da collezione in edizione limitata per arricchire il soggiorno.`,
      `Elegant limited-edition collector's volume to enrich any living room.`
    ),
    matchScore: 97,
    tag: t("Originale / Libro", "Original / Book"),
    amazonSearchQuery: "Hardcover Architecture Luxury Design Coffee Table Book",
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewsCount: 890,
    isPrime: true,
  };

  const card3: Omit<GiftItem, "id"> = {
    title: t("Fellow Stagg EKG Bollitore di Precisione in Acciaio Inox", "Fellow Stagg EKG Precision Stainless Steel Kettle"),
    price: getPrice(0.3), // ~159€
    reason: t(
      `Controllo della temperatura al grado. Kit di qualità premium inossidabile.`,
      `Degree-precise temperature control. Premium stainless steel quality.`
    ),
    matchScore: 98,
    tag: t("Top Qualità", "Top Quality"),
    amazonSearchQuery: "Fellow Stagg EKG Electric Pour Over Kettle",
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 2310,
    isPrime: true,
  };

  return [card1, card2, card3].map((item, index) => ({
    ...item,
    id: `ideeregalo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
  }));
}
