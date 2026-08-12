import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GiftItem, QuizState, CountryConfig } from "../types";
import { buildAmazonUrl, buildAmazonCartUrl } from "../data/countries";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  ShoppingBag,
  ShoppingCart,
  MessageCircle,
  Star,
  Check,
  Sparkles,
  Zap,
  ArrowLeft,
  X,
  CalendarHeart,
} from "lucide-react";
import { Language } from "../data/translations";
import { trackClickAmazonAffiliate, trackClickWhatsappShare } from "../lib/analytics";
import { addReminder } from "../lib/reminders";

interface ResultsDeckAppleProps {
  gifts: GiftItem[];
  quizState: QuizState;
  country: CountryConfig;
  language?: Language;
  initialActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onStartOver: () => void;
  onRegenerate: () => void;
}

export const ResultsDeckApple: React.FC<ResultsDeckAppleProps> = React.memo(({
  gifts,
  quizState,
  country,
  language = "it",
  initialActiveIndex = 0,
  onActiveIndexChange,
  onStartOver,
  onRegenerate,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    return initialActiveIndex < gifts.length ? initialActiveIndex : 0;
  });
  const [copiedWs, setCopiedWs] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // Salva l'occasione DOPO che il valore e gia stato dato (mai prima —
  // e la regola che evita che il concetto di calendario diventi
  // frizione): un tap opzionale, nessun campo obbligatorio oltre alla
  // data. Alimenta il motore di promemoria 14/7/3 giorni gia costruito
  // in pwaNotifications.ts.
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderSaved, setReminderSaved] = useState(false);
  const [reminderName, setReminderName] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  const handleSaveReminder = useCallback(() => {
    if (!reminderDate) return;
    addReminder({
      name: reminderName.trim() || quizState.recipient,
      relation: quizState.recipient,
      date: reminderDate,
    });
    setReminderSaved(true);
    setShowReminderForm(false);
  }, [reminderDate, reminderName, quizState.recipient]);

  const currentGift = gifts[activeIndex] || gifts[0];
  // La prima carta (server.ts la genera sempre come "Più Scelto") è la
  // vera raccomandazione dell'AI — le altre due restano alternative
  // secondarie. Prima le 3 card erano visivamente alla pari: un micro
  // sforzo di confronto in più per l'utente, anche se piccolo. Ora solo
  // la primaria porta l'accento del marchio (corallo) e un ingresso più
  // curato — un'unica decisione facile, non tre opzioni equivalenti.
  const isPrimary = activeIndex === 0;

  const handleSelectIndex = useCallback((newIdx: number) => {
    setActiveIndex(newIdx);
    if (onActiveIndexChange) {
      onActiveIndexChange(newIdx);
    }
  }, [onActiveIndexChange]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % gifts.length;
    handleSelectIndex(nextIdx);
  }, [activeIndex, gifts.length, handleSelectIndex]);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + gifts.length) % gifts.length;
    handleSelectIndex(prevIdx);
  }, [activeIndex, gifts.length, handleSelectIndex]);

  // WhatsApp Greeting Card Text
  const wsText = language === "it"
    ? `Tanti auguri! 🎉 Ho trovato un regalo speciale per te: ${currentGift?.title} (${currentGift?.price})! Guarda qui su Amazon: ${buildAmazonUrl(currentGift?.amazonSearchQuery || "", country, currentGift)}`
    : `Happy Birthday! 🎉 I found a special gift for you: ${currentGift?.title} (${currentGift?.price})! Check it out: ${buildAmazonUrl(currentGift?.amazonSearchQuery || "", country, currentGift)}`;

  const handleCopyWhatsApp = useCallback(() => {
    trackClickWhatsappShare(currentGift?.title);
    navigator.clipboard.writeText(wsText);
    setCopiedWs(true);
    setTimeout(() => setCopiedWs(false), 2500);

    const encoded = encodeURIComponent(wsText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  }, [currentGift?.title, wsText]);

  const handleDragEnd = useCallback((_: any, info: any) => {
    const swipeThreshold = 35;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  }, [handleNext, handlePrev]);

  return (
    <div className="relative w-full h-full bg-[#F2F2F7] flex flex-col justify-between pt-[max(6px,env(safe-area-inset-top,0px))] pb-[max(8px,env(safe-area-inset-bottom,0px))] px-[max(12px,env(safe-area-inset-left,0px))] pr-[max(12px,env(safe-area-inset-right,0px))] select-none max-w-lg sm:max-w-xl md:max-w-2xl mx-auto overflow-hidden font-sans gpu-layer">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between shrink-0 pt-0.5 pb-2 border-b border-[#E5E5EA]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onStartOver}
            className="p-1.5 sm:p-2 rounded-full bg-white border border-[#E5E5EA] text-[#000000] hover:bg-[#E5E5EA] active:scale-95 transition-transform cursor-pointer shadow-2xs shrink-0 gpu-layer"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#000000]" />
          </button>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-extrabold text-[#007AFF] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#007AFF] shrink-0" />
              KADO AI • 3 SELEZIONI PERFETTE
            </span>
            <h2 className="text-xs sm:text-sm font-extrabold text-[#000000] truncate">
              {quizState.recipient} • {quizState.vibe} ({quizState.budget})
            </h2>
          </div>
        </div>

        <button
          onClick={onStartOver}
          className="py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full bg-white border border-[#E5E5EA] text-[#007AFF] hover:bg-[#E5E5EA] active:scale-95 transition-transform text-[11px] sm:text-xs font-bold shadow-2xs cursor-pointer shrink-0 ml-1 gpu-layer"
        >
          {language === "it" ? "Nuova Ricerca" : "New Search"}
        </button>
      </div>

      {/* Main Interactive Container */}
      <div className="relative flex-1 min-h-0 flex flex-col justify-center my-1.5 overflow-y-auto custom-scrollbar px-0.5">
        {/* Progress Dots & Navigation Controls Indicator */}
        <div className="flex items-center justify-between gap-2 mb-2 shrink-0 px-1">
          <div className="flex items-center gap-1.5">
            {gifts.map((g, idx) => (
              <button
                key={g.id || idx}
                onClick={() => handleSelectIndex(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  idx === activeIndex
                    ? "w-6 sm:w-8 bg-[#007AFF]"
                    : "w-1.5 sm:w-2 bg-[#E5E5EA] hover:bg-[#8E8E93]"
                }`}
                aria-label={`Option ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full bg-white border border-[#E5E5EA] text-[#000000] hover:bg-[#E5E5EA] active:scale-90 transition-transform cursor-pointer shadow-2xs flex items-center justify-center"
              title={language === "it" ? "Precedente" : "Previous"}
              aria-label="Previous option"
            >
              <ChevronLeft className="w-4 h-4 text-[#000000]" />
            </button>

            <span className="text-[10px] sm:text-[11px] font-extrabold text-[#8E8E93] px-1 min-w-[32px] text-center">
              {activeIndex + 1} / {gifts.length || 3}
            </span>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-full bg-white border border-[#E5E5EA] text-[#000000] hover:bg-[#E5E5EA] active:scale-90 transition-transform cursor-pointer shadow-2xs flex items-center justify-center"
              title={language === "it" ? "Successivo" : "Next"}
              aria-label="Next option"
            >
              <ChevronRight className="w-4 h-4 text-[#000000]" />
            </button>
          </div>
        </div>

        {/* Animated Swipeable Active Gift Card */}
        {currentGift && (
          <div className="relative w-full flex-1 max-h-[470px] sm:max-h-[510px] flex flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                initial={
                  isPrimary
                    ? { opacity: 0, scale: 0.9, y: 18, rotate: -4 }
                    : { opacity: 0, x: 40 }
                }
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={
                  isPrimary
                    ? { type: "spring", stiffness: 340, damping: 22, mass: 0.9 }
                    : { type: "spring", stiffness: 400, damping: 30, mass: 0.8 }
                }
                className="w-full rounded-[22px] sm:rounded-[26px] bg-white p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3 relative overflow-hidden cursor-grab active:cursor-grabbing gpu-layer"
                style={{
                  touchAction: "pan-y",
                  willChange: "transform, opacity",
                  border: isPrimary ? "2px solid var(--brand-coral)" : "1px solid #E5E5EA",
                  boxShadow: isPrimary
                    ? "0 10px 32px rgba(255,77,109,0.18)"
                    : "0 6px 24px rgba(0,0,0,0.05)",
                }}
              >
                {/* 1. Badge Header */}
                <div className="flex items-center justify-between shrink-0">
                  <div
                    className="flex items-center gap-1 text-[11px] sm:text-xs font-bold"
                    style={{ color: isPrimary ? "var(--brand-coral-dark)" : "#000000" }}
                  >
                    <Zap
                      className="w-3.5 h-3.5 shrink-0"
                      style={{
                        color: isPrimary ? "var(--brand-coral)" : "#007AFF",
                        fill: isPrimary ? "var(--brand-coral)" : "#007AFF",
                      }}
                    />
                    <span>{isPrimary ? (language === "it" ? "La nostra scelta" : "Our pick") : currentGift.tag}</span>
                  </div>

                  {currentGift.isPrime && (
                    <span className="text-[10px] sm:text-xs font-semibold text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded-full tracking-tight">
                      ✓ Prime
                    </span>
                  )}
                </div>

                {/* 2. Amazon Image Stage (Compact & Modern) */}
                <div className="relative w-full h-[125px] sm:h-[145px] rounded-[16px] sm:rounded-[20px] overflow-hidden bg-[#FAFAFC] border border-[#E5E5EA] flex items-center justify-center p-2 shrink-0">
                  <img
                    src={currentGift.imageUrl}
                    alt={currentGift.title}
                    loading="eager"
                    decoding="async"
                    className="max-h-full max-w-full object-contain pointer-events-none gpu-layer"
                  />
                  
                  {/* Price Tag Pill */}
                  <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-[#000000] text-xs sm:text-sm font-extrabold px-2.5 py-1 rounded-full shadow-2xs border border-[#E5E5EA]">
                    {currentGift.price}
                  </div>
                </div>

                {/* 3. Title & Rating Info */}
                <div className="space-y-1">
                  <h3
                    className="text-sm sm:text-base text-[#000000] line-clamp-2 leading-snug"
                    style={
                      isPrimary
                        ? { fontFamily: "var(--font-display)", fontWeight: 600 }
                        : { fontWeight: 800 }
                    }
                  >
                    {currentGift.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#000000] font-semibold">
                    <div className="flex items-center text-[#000000]">
                      <Star className="w-3.5 h-3.5 fill-[#000000] text-[#000000]" />
                      <span className="ml-0.5 font-bold">
                        {currentGift.rating ? currentGift.rating.toFixed(1) : "4.8"}
                      </span>
                    </div>
                    <span className="text-[#8E8E93] font-normal text-[10px] sm:text-[11px]">
                      ({currentGift.reviewsCount ? currentGift.reviewsCount.toLocaleString() : "1.240"} recensioni)
                    </span>
                  </div>
                </div>

                {/* 4. AI Reason Box */}
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F2F2F7] border border-[#E5E5EA]">
                  <p className="text-[11px] sm:text-xs text-[#000000] font-normal leading-relaxed">
                    💡 <span className="font-bold text-[#000000]">Perché è perfetto:</span> {currentGift.reason}
                  </p>
                </div>

                {/* 5. Two Big Action Buttons (VEDI NELLO STORE & METTI IN CARRELLO) */}
                <div className="grid grid-cols-2 gap-2 w-full shrink-0 pt-0.5">
                  <a
                    href={buildAmazonUrl(currentGift.amazonSearchQuery, country, currentGift)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      try {
                        localStorage.setItem("kado_saved_session", JSON.stringify({
                          screen: "results",
                          quizState,
                          gifts,
                          activeCardIndex: activeIndex,
                          timestamp: Date.now(),
                        }));
                      } catch (e) {}
                      trackClickAmazonAffiliate({
                        asin: currentGift.id,
                        title: currentGift.title,
                        price: currentGift.price,
                      });
                    }}
                    className="py-2.5 sm:py-3 px-2 rounded-[16px] bg-white border-2 border-[#007AFF] hover:bg-[#F2F2F7] active:scale-[0.98] text-[#007AFF] font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all uppercase tracking-wider gpu-layer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#007AFF] shrink-0" />
                    <span className="truncate">{language === "it" ? "VEDI NELLO STORE" : "SEE IN STORE"}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#007AFF] shrink-0 hidden sm:inline" />
                  </a>

                  <a
                    href={buildAmazonCartUrl(currentGift, country)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      try {
                        localStorage.setItem("kado_saved_session", JSON.stringify({
                          screen: "results",
                          quizState,
                          gifts,
                          activeCardIndex: activeIndex,
                          timestamp: Date.now(),
                        }));
                      } catch (e) {}
                      trackClickAmazonAffiliate({
                        asin: currentGift.id,
                        title: currentGift.title,
                        price: currentGift.price,
                      });
                    }}
                    className="py-2.5 sm:py-3 px-2 rounded-[16px] active:scale-[0.98] hover:brightness-90 text-white font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all uppercase tracking-wider border-2 gpu-layer"
                    style={{
                      backgroundColor: isPrimary ? "var(--brand-coral)" : "#007AFF",
                      borderColor: isPrimary ? "var(--brand-coral)" : "#007AFF",
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 text-white shrink-0" />
                    <span className="truncate">{language === "it" ? "METTI IN CARRELLO" : "ADD TO CART"}</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Permanently Fixed Bottom Action Buttons */}
      <div className="shrink-0 pt-1.5 border-t border-[#E5E5EA] space-y-1">
        <div className="grid grid-cols-2 gap-2">
          {/* 1. [💬 Copia Biglietto] */}
          <button
            onClick={handleCopyWhatsApp}
            className="py-2.5 sm:py-3 px-2 rounded-2xl bg-white border border-[#E5E5EA] hover:border-[#007AFF] text-[#000000] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-[0.98] gpu-layer"
          >
            <MessageCircle className="w-4 h-4 text-[#007AFF] shrink-0" />
            <span className="truncate">
              {copiedWs
                ? (language === "it" ? "Copiato & Aperto!" : "Copied & Opened!")
                : (language === "it" ? "Copia Biglietto" : "Copy Ticket")}
            </span>
            {copiedWs && <Check className="w-4 h-4 text-[#007AFF] shrink-0" />}
          </button>

          {/* 2. [⚡️ Altre 3 Idee] Direct Regenerate — meccanismo a
              ricompensa variabile (stesso principio dello swipe di
              Tinder: input semplice, esito non del tutto prevedibile),
              probabilmente la leva di engagement con più potenziale
              nell'app. Prima era grigia in fondo, quasi invisibile —
              ora ha un bordo dell'accento di marchio per farsi notare
              senza competere con il CTA primario "Metti in carrello". */}
          <button
            onClick={onRegenerate}
            className="py-2.5 sm:py-3 px-2 rounded-2xl bg-white hover:bg-[#FFF0F2] text-[#000000] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98] gpu-layer border-2"
            style={{ borderColor: "var(--brand-coral)" }}
          >
            <RotateCcw className="w-4 h-4 shrink-0" style={{ color: "var(--brand-coral)" }} />
            <span className="truncate">
              {language === "it" ? "Altre 3 Idee" : "3 More Ideas"}
            </span>
          </button>
        </div>

        {/* Promemoria opzionale — appare SOLO qui, dopo che l'utente ha
            gia ricevuto il valore (il regalo trovato), mai prima o
            dentro il wizard. Un tap, un solo campo obbligatorio (la
            data), nome facoltativo. Questo e cio che trasforma un uso
            singolo in un ritorno futuro. */}
        {!reminderSaved ? (
          <div className="pt-0.5">
            {!showReminderForm ? (
              <button
                onClick={() => {
                  setShowReminderForm(true);
                }}
                className="w-full py-2 px-3 rounded-2xl bg-white border border-dashed border-[#E5E5EA] hover:border-[var(--brand-coral)] text-[11px] sm:text-xs font-semibold text-[#8E8E93] hover:text-[var(--brand-coral-dark)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CalendarHeart className="w-3.5 h-3.5" style={{ color: "var(--brand-coral)" }} />
                {language === "it"
                  ? "Ricordamelo anche l'anno prossimo"
                  : "Remind me again next year"}
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-white border-2 flex flex-col gap-2" style={{ borderColor: "var(--brand-coral)" }}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={reminderName}
                    onChange={(e) => setReminderName(e.target.value)}
                    placeholder={language === "it" ? "Nome (facoltativo)" : "Name (optional)"}
                    className="flex-1 min-w-0 py-2 px-2.5 rounded-xl border border-[#E5E5EA] text-xs text-[#000000] outline-none focus:border-[var(--brand-coral)]"
                  />
                  <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="py-2 px-2.5 rounded-xl border border-[#E5E5EA] text-xs text-[#000000] outline-none focus:border-[var(--brand-coral)]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReminderForm(false)}
                    className="flex-1 py-2 rounded-xl bg-[#F2F2F7] text-[#8E8E93] text-xs font-bold cursor-pointer"
                  >
                    {language === "it" ? "Annulla" : "Cancel"}
                  </button>
                  <button
                    onClick={handleSaveReminder}
                    disabled={!reminderDate}
                    className="flex-1 py-2 rounded-xl text-white text-xs font-bold cursor-pointer disabled:opacity-40"
                    style={{ backgroundColor: "var(--brand-coral)" }}
                  >
                    {language === "it" ? "Salva" : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-0.5 flex items-center justify-center gap-1.5 text-[11px] font-semibold" style={{ color: "var(--brand-coral-dark)" }}>
            <Check className="w-3.5 h-3.5" />
            {language === "it" ? "Promemoria salvato — te lo ricorderemo noi." : "Reminder saved — we'll remind you."}
          </div>
        )}

        {/* Legal Disclaimers: Amazon Affiliate */}
        <div className="text-[9px] sm:text-[10px] text-[#8E8E93] text-center leading-tight px-1 pb-0.5">
          <p>
            {language === "it"
              ? "In qualità di Affiliato Amazon, Kado AI riceve un guadagno dagli acquisti idonei."
              : "As an Amazon Associate, Kado AI earns from qualifying purchases."}
          </p>
        </div>
      </div>
    </div>
  );
});
