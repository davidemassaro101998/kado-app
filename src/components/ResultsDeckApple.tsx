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
  Star,
  Sparkles,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { Language } from "../data/translations";
import { trackClickAmazonAffiliate } from "../lib/analytics";

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
  const [showDrawer, setShowDrawer] = useState(false);

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

  const handleDragEnd = useCallback((_: any, info: any) => {
    const swipeThreshold = 35;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  }, [handleNext, handlePrev]);

  return (
    <div className="relative w-full h-full bg-tactile-linen flex flex-col justify-between pt-[max(6px,env(safe-area-inset-top,0px))] pb-[max(8px,env(safe-area-inset-bottom,0px))] px-[max(12px,env(safe-area-inset-left,0px))] pr-[max(12px,env(safe-area-inset-right,0px))] select-none max-w-lg sm:max-w-xl md:max-w-2xl mx-auto overflow-hidden font-sans">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between shrink-0 pt-0.5 pb-2 border-b border-[#EBE6DC]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onStartOver}
            className="p-1.5 sm:p-2 rounded-full bg-white border border-[#EBE6DC] text-[#000000] hover:bg-[#EBE6DC] active:scale-95 transition-transform cursor-pointer shadow-2xs shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#000000]" />
          </button>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-extrabold text-[#FF4D6D] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF4D6D] shrink-0" />
              KADO AI • 3 SELEZIONI PERFETTE
            </span>
            <h2 className="text-xs sm:text-sm font-extrabold text-[#000000] truncate">
              {quizState.recipient} • {quizState.vibe} ({quizState.budget})
            </h2>
          </div>
        </div>

        <button
          onClick={onStartOver}
          className="py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full bg-white border border-[#EBE6DC] text-[#FF4D6D] hover:bg-[#EBE6DC] active:scale-95 transition-transform text-[11px] sm:text-xs font-bold shadow-2xs cursor-pointer shrink-0 ml-1"
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
                    ? "w-6 sm:w-8 bg-[#FF4D6D]"
                    : "w-1.5 sm:w-2 bg-[#EBE6DC] hover:bg-[#8E8E93]"
                }`}
                aria-label={`Option ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full bg-white border border-[#EBE6DC] text-[#000000] hover:bg-[#EBE6DC] active:scale-90 transition-transform cursor-pointer shadow-2xs flex items-center justify-center"
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
              className="p-1.5 rounded-full bg-white border border-[#EBE6DC] text-[#000000] hover:bg-[#EBE6DC] active:scale-90 transition-transform cursor-pointer shadow-2xs flex items-center justify-center"
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
                  border: isPrimary ? "2px solid var(--brand-coral)" : "1px solid #EBE6DC",
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
                        color: isPrimary ? "var(--brand-coral)" : "#FF4D6D",
                        fill: isPrimary ? "var(--brand-coral)" : "#FF4D6D",
                      }}
                    />
                    <span>{isPrimary ? (language === "it" ? "La nostra scelta" : "Our pick") : currentGift.tag}</span>
                  </div>

                  {currentGift.isPrime && (
                    <span className="text-[10px] sm:text-xs font-semibold text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full tracking-tight">
                      ✓ Prime
                    </span>
                  )}
                </div>

                {/* 2. Amazon Image Stage (Compact & Modern) */}
                <div className="relative w-full h-[125px] sm:h-[145px] rounded-[16px] sm:rounded-[20px] overflow-hidden bg-[#FAFAFC] border border-[#EBE6DC] flex items-center justify-center p-2 shrink-0">
                  <img
                    src={currentGift.imageUrl}
                    alt={currentGift.title}
                    loading="eager"
                    decoding="async"
                    className="max-h-full max-w-full object-contain pointer-events-none"
                  />
                  
                  {/* Price Tag Pill */}
                  <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-[#000000] text-xs sm:text-sm font-extrabold px-2.5 py-1 rounded-full shadow-2xs border border-[#EBE6DC]">
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
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F5F1EA] border border-[#EBE6DC]">
                  <p className="text-[11px] sm:text-xs text-[#000000] font-normal leading-relaxed">
                    💡 <span className="font-bold text-[#000000]">{language === "it" ? "Perché è perfetto:" : "Why it's perfect:"}</span> {currentGift.reason}
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
                    className="py-2.5 sm:py-3 px-2 rounded-[16px] bg-white border-2 border-[#FF4D6D] hover:bg-[#F5F1EA] active:scale-[0.98] text-[#FF4D6D] font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-transform uppercase tracking-wider"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                    <span className="truncate">{language === "it" ? "VEDI NELLO STORE" : "SEE IN STORE"}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0 hidden sm:inline" />
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
                    className="surface-coral-tactile py-2.5 sm:py-3 px-2 rounded-[16px] active:scale-[0.98] hover:brightness-105 text-white font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-transform uppercase tracking-wider border-2 border-transparent"
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
      <div className="shrink-0 pt-1.5 border-t border-[#EBE6DC] space-y-1">
        {/* [⚡️ Altre 3 Idee] Direct Regenerate — meccanismo a ricompensa
            variabile (stesso principio dello swipe di Tinder: input
            semplice, esito non del tutto prevedibile), probabilmente la
            leva di engagement con più potenziale nell'app. */}
        <button
          onClick={onRegenerate}
          className="w-full py-2.5 sm:py-3 px-2 rounded-2xl bg-white hover:bg-[#FFF0F2] text-[#000000] font-bold text-xs flex items-center justify-center gap-1.5 transition-transform cursor-pointer active:scale-[0.98] border-2"
          style={{ borderColor: "var(--brand-coral)" }}
        >
          <RotateCcw className="w-4 h-4 shrink-0" style={{ color: "var(--brand-coral)" }} />
          <span className="truncate">
            {language === "it" ? "Altre 3 Idee" : "3 More Ideas"}
          </span>
        </button>

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
