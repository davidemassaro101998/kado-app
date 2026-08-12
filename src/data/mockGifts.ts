import { GiftItem, QuizState, CountryConfig } from "../types";

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

export function generateSmartFallbackGifts(quiz: QuizState, country: CountryConfig): GiftItem[] {
  const sym = country.symbol || "€";
  const budgetRange = parseBudgetRange(quiz.budget);

  // Helper to get realistic price strictly inside budgetRange
  const getPrice = (fraction: number) => {
    const val = Math.round(budgetRange.min + (budgetRange.max - budgetRange.min) * fraction);
    const finalVal = Math.min(val, budgetRange.max);
    return `${sym}${finalVal}`;
  };

  const recipient = quiz.recipient || "Partner";
  const vibeLower = (quiz.vibe || "").toLowerCase();
  const extraLower = (quiz.extraDetails || "").toLowerCase();
  const combinedText = `${vibeLower} ${extraLower}`;

  // Topic specific overrides
  if (combinedText.includes("padel") || combinedText.includes("tennis")) {
    return [
      {
        id: `ideeregalo-${Date.now()}-0`,
        title: "Grip Professionale Padel & Protezione Bacchetta Set",
        price: getPrice(0.4),
        reason: `Kit indispensabile per migliorare la presa e le prestazioni in campo.`,
        matchScore: 99,
        tag: "Più Scelto",
        amazonSearchQuery: "Overgrip Padel Professionale Kit",
        category: "outdoors",
        imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 1420,
        isPrime: true,
      },
      {
        id: `ideeregalo-${Date.now()}-1`,
        title: "Libro Bestseller 'Padel: Tattiche Vincenti e Mental Game'",
        price: getPrice(0.3),
        reason: `Guida tattica per perfezionare la strategia di gioco per ${recipient}.`,
        matchScore: 97,
        tag: "Originale / Libro",
        amazonSearchQuery: "Libro Tattica Padel Bestseller",
        category: "books",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        reviewsCount: 890,
        isPrime: true,
      },
      {
        id: `ideeregalo-${Date.now()}-2`,
        title: "Tubo Pressurizzatore Palle Padel di Precisione",
        price: getPrice(0.7),
        reason: `Mantiene la pressione ottimale delle palline, ideale per ogni partita.`,
        matchScore: 98,
        tag: "Top Qualità",
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
        title: "Macinacaffè Manuale in Acciaio con Macine Ceramiche",
        price: getPrice(0.5),
        reason: `Per macinare chicchi freschi al momento e sprigionare aromi unici.`,
        matchScore: 99,
        tag: "Più Scelto",
        amazonSearchQuery: "Macinacaffè Manuale Ceramica Acciaio",
        category: "home",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 3120,
        isPrime: true,
      },
      {
        id: `ideeregalo-${Date.now()}-1`,
        title: "Libro Bestseller 'Dalla Pianta alla Tazzina: Il Mondo del Caffè'",
        price: getPrice(0.35),
        reason: `Un viaggio illustrato affascinante tra miscele, estrazioni e degustazioni.`,
        matchScore: 98,
        tag: "Originale / Libro",
        amazonSearchQuery: "Libro Mondo del Caffè Bestseller",
        category: "books",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 1240,
        isPrime: true,
      },
      {
        id: `ideeregalo-${Date.now()}-2`,
        title: "Set Degustazione Caffè Monorigine Specialty in Grani",
        price: getPrice(0.75),
        reason: `Selezione gourmet di arabica pregiate confezionate in scatola regalo.`,
        matchScore: 97,
        tag: "Top Qualità",
        amazonSearchQuery: "Caffè Monorigine Specialty Set Regalo",
        category: "home",
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        reviewsCount: 1850,
        isPrime: true,
      },
    ];
  }

  // Tier 1: Budget under 25€ (e.g., <25€)
  if (budgetRange.max <= 25) {
    let card1: Omit<GiftItem, "id"> = {
      title: "Anker Mini Power Bank Magnetico 5000mAh",
      price: getPrice(0.75), // ~19€
      reason: `Caricabatterie tascabile super compatto e veloce, ideale per ${recipient}.`,
      matchScore: 98,
      tag: "Più Scelto",
      amazonSearchQuery: "Anker Mini Power Bank 5000mAh",
      category: "tech",
      imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviewsCount: 3890,
      isPrime: true,
    };

    if (vibeLower.includes("relax") || vibeLower.includes("cozy") || vibeLower.includes("casa")) {
      card1 = {
        title: "Tazza Termica Inox da Viaggio con Chiusura Ermetica",
        price: getPrice(0.8), // ~20€
        reason: `Mantiene caffe e tisane calde per 8 ore, perfetta per il relax quotidiano.`,
        matchScore: 97,
        tag: "Più Scelto",
        amazonSearchQuery: "Tazza Termica Inox Caffè da Viaggio",
        category: "home",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 2450,
        isPrime: true,
      };
    }

    let card2: Omit<GiftItem, "id"> = {
      title: "Libro Guida Bestseller 'Piccolo Libro della Mindfulness'",
      price: getPrice(0.4), // ~15€
      reason: `Un bestseller tascabile ricco di spunti e consigli pratici per ogni giorno.`,
      matchScore: 96,
      tag: "Originale / Libro",
      amazonSearchQuery: "Piccolo Libro della Mindfulness Bestseller",
      category: "books",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 1890,
      isPrime: true,
    };

    let card3: Omit<GiftItem, "id"> = {
      title: "Set Infusi Biologici Gourmet in Scatola di Latta Design",
      price: getPrice(0.85), // ~21€
      reason: `Selezione di tisane pregiate in elegante confezione regalo per ${recipient}.`,
      matchScore: 97,
      tag: "Top Qualità",
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
      reason: `Ricarica rapida magnetica tascabile. Il bestseller più scelto per gli amanti del tech.`,
      matchScore: 98,
      tag: "Più Scelto",
      amazonSearchQuery: "Anker MagGo Wireless Power Bank 10000mAh",
      category: "tech",
      imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviewsCount: 2890,
      isPrime: true,
    };

    if (vibeLower.includes("relax") || vibeLower.includes("cozy") || vibeLower.includes("wellness")) {
      card1 = {
        title: "Massaggiatore Cervicale Portatile a Calore Infrarossi",
        price: getPrice(0.7), // ~42€
        reason: `Sollievo immediato per collo e spalle, perfetto per il relax di ${recipient}.`,
        matchScore: 98,
        tag: "Più Scelto",
        amazonSearchQuery: "Massaggiatore Cervicale Portatile Calore",
        category: "wellness",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 2150,
        isPrime: true,
      };
    } else if (vibeLower.includes("viaggi") || vibeLower.includes("outdoors")) {
      card1 = {
        title: "Cassa Bluetooth Impermeabile Portatile JBL GO 3",
        price: getPrice(0.5), // ~38€
        reason: `Suono potente e robusto per qualsiasi viaggio o avventura all'aperto.`,
        matchScore: 97,
        tag: "Più Scelto",
        amazonSearchQuery: "JBL GO 3 Cassa Bluetooth Impermeabile",
        category: "outdoors",
        imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewsCount: 5120,
        isPrime: true,
      };
    }

    let card2: Omit<GiftItem, "id"> = {
      title: "Libro Bestseller 'La Scienza della Cucina e del Caffè'",
      price: getPrice(0.2), // ~30€
      reason: `Guida illustrata per scoprire i segreti della gastronomia d'autore e del caffè.`,
      matchScore: 96,
      tag: "Originale / Libro",
      amazonSearchQuery: "La Scienza della Cucina Libro Illustrato Bestseller",
      category: "books",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 1540,
      isPrime: true,
    };

    let card3: Omit<GiftItem, "id"> = {
      title: "Set Diffusore Aromaterapia in Ceramica & Olio Essenziale",
      price: getPrice(0.4), // ~35€
      reason: `Kit ambiente elegante con diffusore ad ultrasuoni per creare l'atmosfera perfetta.`,
      matchScore: 97,
      tag: "Top Qualità",
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
    let card1: Omit<GiftItem, "id"> = {
      title: "Ember Temperature Control Smart Mug Mini 2",
      price: getPrice(0.75), // ~88€
      reason: `Mantiene la bevanda alla temperatura preferita per ore. Il bestseller più amato per ${recipient}.`,
      matchScore: 99,
      tag: "Più Scelto",
      amazonSearchQuery: "Ember Temperature Control Smart Mug 2",
      category: "tech",
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 3420,
      isPrime: true,
    };

    let card2: Omit<GiftItem, "id"> = {
      title: "Kindle Paperwhite Display 6.8\" Luce Calda Regolabile",
      price: getPrice(0.78), // ~89€
      reason: `Lettura immersiva senza riflessi come su carta. Il regalo ideale per chi ama leggere.`,
      matchScore: 99,
      tag: "Originale / Libro",
      amazonSearchQuery: "Kindle Paperwhite 16GB Adjustable Warm Light",
      category: "books",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      reviewsCount: 8400,
      isPrime: true,
    };

    let card3: Omit<GiftItem, "id"> = {
      title: "Fujifilm Instax Mini 12 Kit Fotocamera Istantanea",
      price: getPrice(0.75), // ~88€
      reason: `Kit completo per stampare ricordi istantanei in formato foto carta di credito.`,
      matchScore: 97,
      tag: "Top Qualità",
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
  let card1: Omit<GiftItem, "id"> = {
    title: "Theragun Mini Massaggiatore Muscolare Portatile",
    price: getPrice(0.25), // ~149€
    reason: `Sollievo muscolare profondo e compatto per il benessere quotidiano di ${recipient}.`,
    matchScore: 99,
    tag: "Più Scelto",
    amazonSearchQuery: "Theragun Mini Massager Deep Tissue",
    category: "wellness",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 1950,
    isPrime: true,
  };

  let card2: Omit<GiftItem, "id"> = {
    title: "Hardcover Luxury Design & Architecture Coffee Table Book Collection",
    price: getPrice(0.12), // ~125€
    reason: `Elegante volume da collezione in edizione limitata per arricchire il soggiorno.`,
    matchScore: 97,
    tag: "Originale / Libro",
    amazonSearchQuery: "Hardcover Architecture Luxury Design Coffee Table Book",
    category: "books",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewsCount: 890,
    isPrime: true,
  };

  let card3: Omit<GiftItem, "id"> = {
    title: "Fellow Stagg EKG Bollitore di Precisione in Acciaio Inox",
    price: getPrice(0.3), // ~159€
    reason: `Controllo della temperatura al grado. Kit di qualità premium inossidabile.`,
    matchScore: 98,
    tag: "Top Qualità",
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
