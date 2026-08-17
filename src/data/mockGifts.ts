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

// The 3 fixed diversification badges, mirroring server.ts's GIFT_TAGS so
// the fallback catalog reads identically to an AI-generated result.
const TAGS: Record<Language, [string, string, string]> = {
  en: ["Top Pick", "Original & Books", "Top Quality"],
  it: ["Più Scelto", "Originale / Libro", "Top Qualità"],
  es: ["Más Elegido", "Original y Libros", "Máxima Calidad"],
  fr: ["Le Plus Choisi", "Original et Livres", "Qualité Supérieure"],
  de: ["Meistgewählt", "Originell & Bücher", "Top-Qualität"],
};

interface FallbackContent {
  title: string;
  // May contain a literal "{recipient}" token, replaced at call time.
  reason: string;
  query: string;
}

// Every fallback gift card's copy, in all 5 supported languages. Keyed by
// a stable slug (not by the Italian text) so the lookup below stays
// simple regardless of language. This is the catalog shown whenever
// Gemini is unavailable, times out, or hits the daily cap — i.e.
// precisely the highest-traffic moments — so it has to read as native
// copy in every supported language, not just Italian.
const CONTENT: Record<string, Record<Language, FallbackContent>> = {
  padelGrip: {
    it: { title: "Grip Professionale Padel & Protezione Bacchetta Set", reason: "Kit indispensabile per migliorare la presa e le prestazioni in campo.", query: "Overgrip Padel Professionale Kit" },
    en: { title: "Professional Padel Grip & Racket Protection Set", reason: "An essential kit to improve your grip and on-court performance.", query: "Padel Overgrip Professional Kit" },
    es: { title: "Set Profesional de Grip para Pádel y Protector de Pala", reason: "Kit imprescindible para mejorar el agarre y el rendimiento en pista.", query: "Overgrip Pádel Profesional Kit" },
    fr: { title: "Kit Grip Professionnel Padel & Protection de Raquette", reason: "Un kit indispensable pour améliorer la prise en main et la performance sur le court.", query: "Surgrip Padel Professionnel Kit" },
    de: { title: "Profi-Padel-Griffband & Schlägerschutz-Set", reason: "Unverzichtbares Set für besseren Grip und mehr Leistung auf dem Platz.", query: "Padel Overgrip Profi Set" },
  },
  padelBook: {
    it: { title: "Libro Bestseller 'Padel: Tattiche Vincenti e Mental Game'", reason: "Guida tattica per perfezionare la strategia di gioco per {recipient}.", query: "Libro Tattica Padel Bestseller" },
    en: { title: "Bestseller Book 'Padel: Winning Tactics and Mental Game'", reason: "A tactical guide to sharpen {recipient}'s game strategy.", query: "Padel Tactics Bestseller Book" },
    es: { title: "Libro Bestseller 'Pádel: Tácticas Ganadoras y Juego Mental'", reason: "Guía táctica para perfeccionar la estrategia de juego de {recipient}.", query: "Libro Táctica Pádel Bestseller" },
    fr: { title: "Livre à Succès « Padel : Tactiques Gagnantes et Mental de Jeu »", reason: "Un guide tactique pour affiner la stratégie de jeu de {recipient}.", query: "Livre Tactique Padel Best-seller" },
    de: { title: "Bestseller-Buch 'Padel: Siegreiche Taktiken und Mentales Spiel'", reason: "Ein taktischer Leitfaden, um die Spielstrategie von {recipient} zu verfeinern.", query: "Padel Taktik Bestseller Buch" },
  },
  padelPump: {
    it: { title: "Tubo Pressurizzatore Palle Padel di Precisione", reason: "Mantiene la pressione ottimale delle palline, ideale per ogni partita.", query: "Pressurizzatore Palline Padel" },
    en: { title: "Precision Padel Ball Pressurizer Tube", reason: "Keeps balls at optimal pressure, perfect for every match.", query: "Padel Ball Pressurizer" },
    es: { title: "Tubo Presurizador de Precisión para Pelotas de Pádel", reason: "Mantiene la presión óptima de las pelotas, ideal para cada partido.", query: "Presurizador Pelotas Pádel" },
    fr: { title: "Tube Pressurisateur de Précision pour Balles de Padel", reason: "Maintient la pression optimale des balles, idéal pour chaque match.", query: "Pressurisateur Balles Padel" },
    de: { title: "Präzisions-Druckröhre für Padelbälle", reason: "Hält die Bälle auf optimalem Druck – ideal für jedes Match.", query: "Padelball Druckbehälter" },
  },
  coffeeGrinder: {
    it: { title: "Macinacaffè Manuale in Acciaio con Macine Ceramiche", reason: "Per macinare chicchi freschi al momento e sprigionare aromi unici.", query: "Macinacaffè Manuale Ceramica Acciaio" },
    en: { title: "Manual Steel Coffee Grinder with Ceramic Burrs", reason: "Grinds fresh beans on the spot to unlock unique aromas.", query: "Manual Coffee Grinder Ceramic Steel" },
    es: { title: "Molinillo de Café Manual de Acero con Muelas Cerámicas", reason: "Muele granos frescos al momento para liberar aromas únicos.", query: "Molinillo Café Manual Cerámica" },
    fr: { title: "Moulin à Café Manuel en Acier avec Meules en Céramique", reason: "Mouture de grains frais à la minute pour révéler des arômes uniques.", query: "Moulin à Café Manuel Céramique" },
    de: { title: "Manuelle Kaffeemühle aus Stahl mit Keramikmahlwerk", reason: "Mahlt frische Bohnen auf Knopfdruck und entfaltet einzigartige Aromen.", query: "Manuelle Kaffeemühle Keramik Stahl" },
  },
  coffeeBook: {
    it: { title: "Libro Bestseller 'Dalla Pianta alla Tazzina: Il Mondo del Caffè'", reason: "Un viaggio illustrato affascinante tra miscele, estrazioni e degustazioni.", query: "Libro Mondo del Caffè Bestseller" },
    en: { title: "Bestseller Book 'From Plant to Cup: The World of Coffee'", reason: "A fascinating illustrated journey through blends, brewing, and tasting.", query: "World of Coffee Bestseller Book" },
    es: { title: "Libro Bestseller 'De la Planta a la Taza: El Mundo del Café'", reason: "Un fascinante viaje ilustrado por mezclas, extracciones y catas.", query: "Libro Mundo del Café Bestseller" },
    fr: { title: "Livre à Succès « De la Plante à la Tasse : Le Monde du Café »", reason: "Un voyage illustré fascinant entre mélanges, extractions et dégustations.", query: "Livre Monde du Café Best-seller" },
    de: { title: "Bestseller-Buch 'Von der Pflanze zur Tasse: Die Welt des Kaffees'", reason: "Eine faszinierende, bebilderte Reise durch Mischungen, Zubereitung und Verkostung.", query: "Kaffeewelt Bestseller Buch" },
  },
  coffeeSet: {
    it: { title: "Set Degustazione Caffè Monorigine Specialty in Grani", reason: "Selezione gourmet di arabica pregiate confezionate in scatola regalo.", query: "Caffè Monorigine Specialty Set Regalo" },
    en: { title: "Single-Origin Specialty Coffee Bean Tasting Set", reason: "A gourmet selection of prized arabica beans in a gift box.", query: "Single Origin Specialty Coffee Gift Set" },
    es: { title: "Set de Cata de Café Specialty de Origen Único en Grano", reason: "Selección gourmet de arábica de calidad en una elegante caja regalo.", query: "Café Origen Único Specialty Set Regalo" },
    fr: { title: "Coffret Dégustation Café Specialty Mono-Origine en Grains", reason: "Sélection gourmande de grains d'arabica d'exception, en coffret cadeau.", query: "Café Specialty Mono-Origine Coffret Cadeau" },
    de: { title: "Verkostungsset Specialty-Kaffeebohnen aus Einzelanbau", reason: "Erlesene Arabica-Auswahl in einer eleganten Geschenkbox.", query: "Single Origin Specialty Kaffee Geschenkset" },
  },
  tier1PowerBank: {
    it: { title: "Anker Mini Power Bank Magnetico 5000mAh", reason: "Caricabatterie tascabile super compatto e veloce, ideale per {recipient}.", query: "Anker Mini Power Bank 5000mAh" },
    en: { title: "Anker Mini Magnetic Power Bank 5000mAh", reason: "A super-compact, fast pocket charger, perfect for {recipient}.", query: "Anker Mini Power Bank 5000mAh" },
    es: { title: "Power Bank Magnético Mini Anker 5000mAh", reason: "Cargador de bolsillo súper compacto y rápido, ideal para {recipient}.", query: "Anker Mini Power Bank 5000mAh" },
    fr: { title: "Mini Batterie Externe Magnétique Anker 5000mAh", reason: "Chargeur de poche ultra-compact et rapide, parfait pour {recipient}.", query: "Anker Mini Power Bank 5000mAh" },
    de: { title: "Anker Mini Magnet-Powerbank 5000mAh", reason: "Superkompaktes, schnelles Taschenladegerät – perfekt für {recipient}.", query: "Anker Mini Power Bank 5000mAh" },
  },
  tier1ThermalMug: {
    it: { title: "Tazza Termica Inox da Viaggio con Chiusura Ermetica", reason: "Mantiene caffè e tisane calde per 8 ore, perfetta per il relax quotidiano.", query: "Tazza Termica Inox Caffè da Viaggio" },
    en: { title: "Stainless Steel Travel Mug with Airtight Seal", reason: "Keeps coffee and tea hot for 8 hours — perfect for everyday relaxation.", query: "Stainless Steel Travel Coffee Mug" },
    es: { title: "Taza Térmica de Acero Inoxidable con Cierre Hermético", reason: "Mantiene el café y las infusiones calientes 8 horas, perfecta para el relax diario.", query: "Taza Térmica Acero Viaje Café" },
    fr: { title: "Mug de Voyage Isotherme en Inox à Fermeture Hermétique", reason: "Garde café et infusions au chaud pendant 8 heures — parfait pour la détente au quotidien.", query: "Mug Isotherme Inox Café Voyage" },
    de: { title: "Edelstahl-Thermobecher mit Luftdichtem Verschluss", reason: "Hält Kaffee und Tee 8 Stunden warm – perfekt für die tägliche Entspannung.", query: "Edelstahl Thermobecher Kaffee Reise" },
  },
  tier1MindfulnessBook: {
    it: { title: "Libro Guida Bestseller 'Piccolo Libro della Mindfulness'", reason: "Un bestseller tascabile ricco di spunti e consigli pratici per ogni giorno.", query: "Piccolo Libro della Mindfulness Bestseller" },
    en: { title: "Bestseller Guide 'The Little Book of Mindfulness'", reason: "A pocket bestseller packed with practical everyday tips and inspiration.", query: "Little Book of Mindfulness Bestseller" },
    es: { title: "Libro Guía Bestseller 'El Pequeño Libro del Mindfulness'", reason: "Un bestseller de bolsillo lleno de ideas y consejos prácticos para el día a día.", query: "Pequeño Libro del Mindfulness Bestseller" },
    fr: { title: "Guide à Succès « Le Petit Livre de la Pleine Conscience »", reason: "Un bestseller de poche riche en idées et conseils pratiques pour le quotidien.", query: "Petit Livre Pleine Conscience Best-seller" },
    de: { title: "Bestseller-Ratgeber 'Das kleine Buch der Achtsamkeit'", reason: "Ein Taschen-Bestseller voller praktischer Alltagstipps und Inspiration.", query: "Kleines Buch der Achtsamkeit Bestseller" },
  },
  tier1HerbalTeaSet: {
    it: { title: "Set Infusi Biologici Gourmet in Scatola di Latta Design", reason: "Selezione di tisane pregiate in elegante confezione regalo per {recipient}.", query: "Set Tisane Biologiche Scatola Regalo Latta" },
    en: { title: "Gourmet Organic Herbal Tea Set in a Designer Tin", reason: "A selection of fine herbal teas in an elegant gift box for {recipient}.", query: "Organic Herbal Tea Gift Set Tin" },
    es: { title: "Set Gourmet de Infusiones Ecológicas en Lata de Diseño", reason: "Selección de infusiones exquisitas en un elegante estuche regalo para {recipient}.", query: "Set Infusiones Ecológicas Caja Regalo" },
    fr: { title: "Coffret Infusions Bio Gourmet en Boîte Métal Design", reason: "Une sélection d'infusions raffinées dans un joli coffret cadeau pour {recipient}.", query: "Coffret Infusions Bio Boîte Cadeau" },
    de: { title: "Bio-Kräutertee-Set Gourmet in Design-Dose", reason: "Auswahl edler Kräutertees in einer eleganten Geschenkbox für {recipient}.", query: "Bio Kräutertee Geschenkset Dose" },
  },
  tier2MagGoPowerBank: {
    it: { title: "Anker MagGo Power Bank Wireless Magnetico 10000mAh", reason: "Ricarica rapida magnetica tascabile. Il bestseller più scelto per gli amanti del tech.", query: "Anker MagGo Wireless Power Bank 10000mAh" },
    en: { title: "Anker MagGo Wireless Magnetic Power Bank 10000mAh", reason: "Pocket-sized magnetic fast charging — the top pick for tech lovers.", query: "Anker MagGo Wireless Power Bank 10000mAh" },
    es: { title: "Power Bank Inalámbrico Magnético Anker MagGo 10000mAh", reason: "Carga rápida magnética de bolsillo. El favorito de los amantes de la tecnología.", query: "Anker MagGo Wireless Power Bank 10000mAh" },
    fr: { title: "Batterie Externe Sans Fil Magnétique Anker MagGo 10000mAh", reason: "Charge rapide magnétique format poche — le favori des passionnés de tech.", query: "Anker MagGo Wireless Power Bank 10000mAh" },
    de: { title: "Anker MagGo Kabelloses Magnet-Powerbank 10000mAh", reason: "Magnetisches Schnellladen im Taschenformat – der Favorit für Technikfans.", query: "Anker MagGo Wireless Power Bank 10000mAh" },
  },
  tier2Massager: {
    it: { title: "Massaggiatore Cervicale Portatile a Calore Infrarossi", reason: "Sollievo immediato per collo e spalle, perfetto per il relax di {recipient}.", query: "Massaggiatore Cervicale Portatile Calore" },
    en: { title: "Portable Infrared Heat Neck Massager", reason: "Instant relief for neck and shoulders — perfect for {recipient}'s relaxation.", query: "Portable Neck Massager Heat" },
    es: { title: "Masajeador Cervical Portátil con Calor Infrarrojo", reason: "Alivio inmediato para cuello y hombros, perfecto para el relax de {recipient}.", query: "Masajeador Cervical Portátil Calor" },
    fr: { title: "Masseur Cervical Portable à Chaleur Infrarouge", reason: "Soulagement immédiat pour la nuque et les épaules — parfait pour la détente de {recipient}.", query: "Masseur Cervical Portable Chaleur" },
    de: { title: "Tragbares Nacken-Massagegerät mit Infrarotwärme", reason: "Sofortige Linderung für Nacken und Schultern – perfekt zur Entspannung für {recipient}.", query: "Tragbares Nackenmassagegerät Wärme" },
  },
  tier2JblSpeaker: {
    it: { title: "Cassa Bluetooth Impermeabile Portatile JBL GO 3", reason: "Suono potente e robusto per qualsiasi viaggio o avventura all'aperto.", query: "JBL GO 3 Cassa Bluetooth Impermeabile" },
    en: { title: "JBL GO 3 Portable Waterproof Bluetooth Speaker", reason: "Powerful, rugged sound for any trip or outdoor adventure.", query: "JBL GO 3 Waterproof Bluetooth Speaker" },
    es: { title: "Altavoz Bluetooth Impermeable Portátil JBL GO 3", reason: "Sonido potente y resistente para cualquier viaje o aventura al aire libre.", query: "JBL GO 3 Altavoz Bluetooth Impermeable" },
    fr: { title: "Enceinte Bluetooth Portable Étanche JBL GO 3", reason: "Un son puissant et robuste pour tout voyage ou aventure en plein air.", query: "JBL GO 3 Enceinte Bluetooth Étanche" },
    de: { title: "JBL GO 3 Tragbarer Wasserdichter Bluetooth-Lautsprecher", reason: "Kraftvoller, robuster Sound für jede Reise oder jedes Outdoor-Abenteuer.", query: "JBL GO 3 Wasserdichter Bluetooth Lautsprecher" },
  },
  tier2CookingBook: {
    it: { title: "Libro Bestseller 'La Scienza della Cucina e del Caffè'", reason: "Guida illustrata per scoprire i segreti della gastronomia d'autore e del caffè.", query: "La Scienza della Cucina Libro Illustrato Bestseller" },
    en: { title: "Bestseller Book 'The Science of Cooking and Coffee'", reason: "An illustrated guide to the secrets of fine cooking and coffee.", query: "Science of Cooking Illustrated Bestseller Book" },
    es: { title: "Libro Bestseller 'La Ciencia de la Cocina y el Café'", reason: "Guía ilustrada para descubrir los secretos de la alta gastronomía y el café.", query: "La Ciencia de la Cocina Libro Ilustrado Bestseller" },
    fr: { title: "Livre à Succès « La Science de la Cuisine et du Café »", reason: "Un guide illustré pour percer les secrets de la gastronomie et du café.", query: "La Science de la Cuisine Livre Illustré Best-seller" },
    de: { title: "Bestseller-Buch 'Die Wissenschaft von Kochkunst und Kaffee'", reason: "Ein illustrierter Leitfaden zu den Geheimnissen von Kochkunst und Kaffee.", query: "Die Wissenschaft des Kochens Bestseller Buch" },
  },
  tier2AromaDiffuser: {
    it: { title: "Set Diffusore Aromaterapia in Ceramica & Olio Essenziale", reason: "Kit ambiente elegante con diffusore ad ultrasuoni per creare l'atmosfera perfetta.", query: "Diffusore Aromaterapia Ceramica Olio Essenziale" },
    en: { title: "Ceramic Aromatherapy Diffuser & Essential Oil Set", reason: "An elegant ultrasonic diffuser kit to set the perfect mood.", query: "Aromatherapy Ceramic Essential Oil Diffuser Set" },
    es: { title: "Set Difusor de Aromaterapia de Cerámica y Aceite Esencial", reason: "Elegante kit con difusor ultrasónico para crear el ambiente perfecto.", query: "Difusor Aromaterapia Cerámica Aceite Esencial" },
    fr: { title: "Coffret Diffuseur d'Aromathérapie en Céramique & Huile Essentielle", reason: "Un élégant diffuseur à ultrasons pour créer l'ambiance parfaite.", query: "Diffuseur Aromathérapie Céramique Huile Essentielle" },
    de: { title: "Keramik-Aromatherapie-Diffusor-Set mit Ätherischem Öl", reason: "Elegantes Ultraschall-Diffusor-Set für die perfekte Atmosphäre.", query: "Aromatherapie Keramik Diffusor Ätherisches Öl" },
  },
  tier3EmberMug: {
    it: { title: "Ember Temperature Control Smart Mug Mini 2", reason: "Mantiene la bevanda alla temperatura preferita per ore. Il bestseller più amato per {recipient}.", query: "Ember Temperature Control Smart Mug 2" },
    en: { title: "Ember Temperature Control Smart Mug Mini 2", reason: "Keeps drinks at the perfect temperature for hours — a favorite pick for {recipient}.", query: "Ember Temperature Control Smart Mug 2" },
    es: { title: "Ember Temperature Control Smart Mug Mini 2", reason: "Mantiene la bebida a la temperatura ideal durante horas. El favorito para {recipient}.", query: "Ember Temperature Control Smart Mug 2" },
    fr: { title: "Ember Temperature Control Smart Mug Mini 2", reason: "Garde la boisson à température idéale pendant des heures — un coup de cœur pour {recipient}.", query: "Ember Temperature Control Smart Mug 2" },
    de: { title: "Ember Temperature Control Smart Mug Mini 2", reason: "Hält Getränke stundenlang auf Wunschtemperatur – ein Favorit für {recipient}.", query: "Ember Temperature Control Smart Mug 2" },
  },
  tier3Kindle: {
    it: { title: "Kindle Paperwhite Display 6.8\" Luce Calda Regolabile", reason: "Lettura immersiva senza riflessi come su carta. Il regalo ideale per chi ama leggere.", query: "Kindle Paperwhite 16GB Adjustable Warm Light" },
    en: { title: "Kindle Paperwhite 6.8\" Display, Adjustable Warm Light", reason: "Immersive, glare-free reading just like paper — the ideal gift for book lovers.", query: "Kindle Paperwhite 16GB Adjustable Warm Light" },
    es: { title: "Kindle Paperwhite Pantalla 6.8\" con Luz Cálida Ajustable", reason: "Lectura inmersiva sin reflejos, como en papel. El regalo ideal para quien ama leer.", query: "Kindle Paperwhite 16GB Adjustable Warm Light" },
    fr: { title: "Kindle Paperwhite Écran 6.8\" à Lumière Chaude Ajustable", reason: "Une lecture immersive et sans reflets, comme sur papier — le cadeau idéal pour les lecteurs.", query: "Kindle Paperwhite 16GB Adjustable Warm Light" },
    de: { title: "Kindle Paperwhite 6.8\"-Display mit Einstellbarem Warmlicht", reason: "Blendfreies Lesevergnügen wie auf Papier – das ideale Geschenk für Leseratten.", query: "Kindle Paperwhite 16GB Adjustable Warm Light" },
  },
  tier3Instax: {
    it: { title: "Fujifilm Instax Mini 12 Kit Fotocamera Istantanea", reason: "Kit completo per stampare ricordi istantanei in formato foto carta di credito.", query: "Fujifilm Instax Mini 12 Instant Camera Kit" },
    en: { title: "Fujifilm Instax Mini 12 Instant Camera Kit", reason: "A complete kit to print instant memories in credit-card-sized photos.", query: "Fujifilm Instax Mini 12 Instant Camera Kit" },
    es: { title: "Kit Cámara Instantánea Fujifilm Instax Mini 12", reason: "Kit completo para imprimir recuerdos al instante en formato tarjeta.", query: "Fujifilm Instax Mini 12 Instant Camera Kit" },
    fr: { title: "Kit Appareil Photo Instantané Fujifilm Instax Mini 12", reason: "Un kit complet pour imprimer des souvenirs instantanés au format carte de crédit.", query: "Fujifilm Instax Mini 12 Instant Camera Kit" },
    de: { title: "Fujifilm Instax Mini 12 Sofortbildkamera-Set", reason: "Komplettes Set, um Erinnerungen sofort im Kreditkartenformat auszudrucken.", query: "Fujifilm Instax Mini 12 Instant Camera Kit" },
  },
  tier4Theragun: {
    it: { title: "Theragun Mini Massaggiatore Muscolare Portatile", reason: "Sollievo muscolare profondo e compatto per il benessere quotidiano di {recipient}.", query: "Theragun Mini Massager Deep Tissue" },
    en: { title: "Theragun Mini Portable Muscle Massager", reason: "Deep, compact muscle relief for {recipient}'s everyday wellness.", query: "Theragun Mini Massager Deep Tissue" },
    es: { title: "Theragun Mini Masajeador Muscular Portátil", reason: "Alivio muscular profundo y compacto para el bienestar diario de {recipient}.", query: "Theragun Mini Massager Deep Tissue" },
    fr: { title: "Theragun Mini Masseur Musculaire Portable", reason: "Un soulagement musculaire profond et compact pour le bien-être quotidien de {recipient}.", query: "Theragun Mini Massager Deep Tissue" },
    de: { title: "Theragun Mini Tragbares Muskel-Massagegerät", reason: "Tiefenwirksame, kompakte Muskelentspannung für das tägliche Wohlbefinden von {recipient}.", query: "Theragun Mini Massager Deep Tissue" },
  },
  tier4CoffeeTableBook: {
    it: { title: "Libro Fotografico Design e Architettura di Lusso", reason: "Elegante volume da collezione in edizione limitata per arricchire il soggiorno.", query: "Libro Fotografico Design Architettura Lusso" },
    en: { title: "Hardcover Luxury Design & Architecture Coffee Table Book Collection", reason: "An elegant limited-edition collectible volume to enrich any living room.", query: "Hardcover Architecture Luxury Design Coffee Table Book" },
    es: { title: "Libro Fotográfico de Diseño y Arquitectura de Lujo", reason: "Elegante volumen de colección en edición limitada para el salón.", query: "Libro Fotográfico Diseño Arquitectura Lujo" },
    fr: { title: "Beau Livre Design et Architecture de Luxe", reason: "Un élégant volume de collection en édition limitée pour sublimer le salon.", query: "Beau Livre Design Architecture Luxe" },
    de: { title: "Bildband Luxus-Design und Architektur", reason: "Elegantes Sammlerstück in limitierter Auflage für jedes Wohnzimmer.", query: "Bildband Luxus Design Architektur" },
  },
  tier4FellowKettle: {
    it: { title: "Fellow Stagg EKG Bollitore di Precisione in Acciaio Inox", reason: "Controllo della temperatura al grado. Kit di qualità premium inossidabile.", query: "Fellow Stagg EKG Electric Pour Over Kettle" },
    en: { title: "Fellow Stagg EKG Stainless Steel Precision Kettle", reason: "Degree-precise temperature control in a premium stainless steel build.", query: "Fellow Stagg EKG Electric Pour Over Kettle" },
    es: { title: "Hervidor de Precisión Fellow Stagg EKG de Acero Inoxidable", reason: "Control de temperatura al grado, con acabado premium de acero inoxidable.", query: "Fellow Stagg EKG Electric Pour Over Kettle" },
    fr: { title: "Bouilloire de Précision Fellow Stagg EKG en Inox", reason: "Contrôle de la température au degré près, finition premium en inox.", query: "Fellow Stagg EKG Electric Pour Over Kettle" },
    de: { title: "Fellow Stagg EKG Präzisions-Wasserkocher aus Edelstahl", reason: "Gradgenaue Temperaturkontrolle in hochwertiger Edelstahl-Verarbeitung.", query: "Fellow Stagg EKG Electric Pour Over Kettle" },
  },
};

// Resolves one content slot for the given language (falling back to
// English on a missing key, same convention used everywhere else in the
// app) and substitutes the {recipient} token where present.
function pick(key: string, language: Language, recipient: string): FallbackContent {
  const entry = CONTENT[key][language] || CONTENT[key].en;
  return { ...entry, reason: entry.reason.replace("{recipient}", recipient) };
}

export function generateSmartFallbackGifts(quiz: QuizState, country: CountryConfig, language: Language = "en"): GiftItem[] {
  const sym = country.symbol || "€";
  const budgetRange = parseBudgetRange(quiz.budget);
  const [tagTopPick, tagOriginalBooks, tagTopQuality] = TAGS[language] || TAGS.en;

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

  function buildCard(key: string, opts: { price: string; matchScore: number; tag: string; category: string; imageUrl: string; rating: number; reviewsCount: number }): Omit<GiftItem, "id"> {
    const content = pick(key, language, recipient);
    return {
      title: content.title,
      price: opts.price,
      reason: content.reason,
      matchScore: opts.matchScore,
      tag: opts.tag,
      amazonSearchQuery: content.query,
      category: opts.category,
      imageUrl: opts.imageUrl,
      rating: opts.rating,
      reviewsCount: opts.reviewsCount,
      isPrime: true,
    };
  }

  function withIds(cards: Omit<GiftItem, "id">[]): GiftItem[] {
    return cards.map((item, index) => ({
      ...item,
      id: `ideeregalo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    }));
  }

  // Topic specific overrides
  if (combinedText.includes("padel") || combinedText.includes("tennis")) {
    return withIds([
      buildCard("padelGrip", { price: getPrice(0.4), matchScore: 99, tag: tagTopPick, category: "outdoors", imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 1420 }),
      buildCard("padelBook", { price: getPrice(0.3), matchScore: 97, tag: tagOriginalBooks, category: "books", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80", rating: 4.9, reviewsCount: 890 }),
      buildCard("padelPump", { price: getPrice(0.7), matchScore: 98, tag: tagTopQuality, category: "outdoors", imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 2100 }),
    ]);
  }

  if (combinedText.includes("caffè") || combinedText.includes("caffe") || combinedText.includes("coffee")) {
    return withIds([
      buildCard("coffeeGrinder", { price: getPrice(0.5), matchScore: 99, tag: tagTopPick, category: "home", imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 3120 }),
      buildCard("coffeeBook", { price: getPrice(0.35), matchScore: 98, tag: tagOriginalBooks, category: "books", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 1240 }),
      buildCard("coffeeSet", { price: getPrice(0.75), matchScore: 97, tag: tagTopQuality, category: "home", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80", rating: 4.9, reviewsCount: 1850 }),
    ]);
  }

  // Tier 1: Budget under 25€ (e.g., <25€)
  if (budgetRange.max <= 25) {
    const card1Key = vibeLower.includes("relax") || vibeLower.includes("cozy") || vibeLower.includes("casa") ? "tier1ThermalMug" : "tier1PowerBank";
    return withIds([
      buildCard(card1Key, { price: getPrice(card1Key === "tier1ThermalMug" ? 0.8 : 0.75), matchScore: card1Key === "tier1ThermalMug" ? 97 : 98, tag: tagTopPick, category: card1Key === "tier1ThermalMug" ? "home" : "tech", imageUrl: card1Key === "tier1ThermalMug" ? "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" : "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80", rating: card1Key === "tier1ThermalMug" ? 4.8 : 4.7, reviewsCount: card1Key === "tier1ThermalMug" ? 2450 : 3890 }),
      buildCard("tier1MindfulnessBook", { price: getPrice(0.4), matchScore: 96, tag: tagOriginalBooks, category: "books", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 1890 }),
      buildCard("tier1HerbalTeaSet", { price: getPrice(0.85), matchScore: 97, tag: tagTopQuality, category: "wellness", imageUrl: "https://images.unsplash.com/photo-1512290900673-3e742880a4dd?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 1560 }),
    ]);
  }

  // Tier 2: Budget 25 - 50€
  if (budgetRange.max <= 50) {
    let card1Key = "tier2MagGoPowerBank";
    if (vibeLower.includes("relax") || vibeLower.includes("cozy") || vibeLower.includes("wellness")) card1Key = "tier2Massager";
    else if (vibeLower.includes("viaggi") || vibeLower.includes("outdoors")) card1Key = "tier2JblSpeaker";

    const card1Meta: Record<string, { price: number; matchScore: number; category: string; imageUrl: string; rating: number; reviewsCount: number }> = {
      tier2MagGoPowerBank: { price: 0.55, matchScore: 98, category: "tech", imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 2890 },
      tier2Massager: { price: 0.7, matchScore: 98, category: "wellness", imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 2150 },
      tier2JblSpeaker: { price: 0.5, matchScore: 97, category: "outdoors", imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 5120 },
    };
    const meta = card1Meta[card1Key];

    return withIds([
      buildCard(card1Key, { price: getPrice(meta.price), matchScore: meta.matchScore, tag: tagTopPick, category: meta.category, imageUrl: meta.imageUrl, rating: meta.rating, reviewsCount: meta.reviewsCount }),
      buildCard("tier2CookingBook", { price: getPrice(0.2), matchScore: 96, tag: tagOriginalBooks, category: "books", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 1540 }),
      buildCard("tier2AromaDiffuser", { price: getPrice(0.4), matchScore: 97, tag: tagTopQuality, category: "wellness", imageUrl: "https://images.unsplash.com/photo-1608248597260-1e582803b9b4?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 1820 }),
    ]);
  }

  // Tier 3: Budget 50 - 100€
  if (budgetRange.max <= 100) {
    return withIds([
      buildCard("tier3EmberMug", { price: getPrice(0.75), matchScore: 99, tag: tagTopPick, category: "tech", imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 3420 }),
      buildCard("tier3Kindle", { price: getPrice(0.78), matchScore: 99, tag: tagOriginalBooks, category: "books", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80", rating: 4.9, reviewsCount: 8400 }),
      buildCard("tier3Instax", { price: getPrice(0.75), matchScore: 97, tag: tagTopQuality, category: "creative", imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 3100 }),
    ]);
  }

  // Tier 4: Budget > 100€
  return withIds([
    buildCard("tier4Theragun", { price: getPrice(0.25), matchScore: 99, tag: tagTopPick, category: "wellness", imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 1950 }),
    buildCard("tier4CoffeeTableBook", { price: getPrice(0.12), matchScore: 97, tag: tagOriginalBooks, category: "books", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 890 }),
    buildCard("tier4FellowKettle", { price: getPrice(0.3), matchScore: 98, tag: tagTopQuality, category: "home", imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 2310 }),
  ]);
}
