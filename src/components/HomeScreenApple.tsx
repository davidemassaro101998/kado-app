import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import {
  Mic,
  Camera,
  Sparkles,
  Heart,
  Users,
  Smile,
  Briefcase,
  Coffee,
  Laptop,
  Home as HomeIcon,
  Compass,
  Crown,
  PartyPopper,
  ArrowLeft,
  ChevronRight,
  Search,
  X,
  Check,
} from "lucide-react";
import { QuizState, FormatPillType, CountryConfig } from "../types";
import { Language } from "../data/translations";
import { getBudgetOptions, getDefaultBudget, formatCustomBudget } from "../data/budgetBands";
import {
  trackPageViewHome,
  trackWizardStep1,
  trackWizardStep2,
  trackWizardStep3,
} from "../lib/analytics";
import { VoiceDrawer, VoiceDrawerHandle } from "./VoiceDrawer";
import { CameraDrawer } from "./CameraDrawer";

interface HomeScreenAppleProps {
  onGenerateGifts: (quizData: QuizState) => void;
  language?: Language;
  country: CountryConfig;
}

export const HomeScreenApple: React.FC<HomeScreenAppleProps> = React.memo(({
  onGenerateGifts,
  language = "it",
  country,
}) => {
  // Page View Analytics
  useEffect(() => {
    trackPageViewHome();
  }, []);

  // Wizard Step State (1, 2, or 3) & Form State Restoration
  const savedHomeForm = React.useMemo(() => {
    try {
      const stored = localStorage.getItem("kado_home_form_state");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  }, []);

  // Il wizard riparte sempre da step 1 a ogni mount (cold start/refresh):
  // solo le scelte già fatte vengono ripristinate, non l'avanzamento.
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [stepDirection, setStepDirection] = useState<number>(1); // 1 = forward, -1 = back
  const voiceDrawerRef = useRef<VoiceDrawerHandle>(null);

  // Form State
  const [recipient, setRecipient] = useState<string>(() => savedHomeForm?.recipient || "Partner");
  const [vibe, setVibe] = useState<string>(() => savedHomeForm?.vibe || "Tech");
  const [budget, setBudget] = useState<string>(() => savedHomeForm?.budget || getDefaultBudget(country.currency, country.symbol));
  const [customBudgetInput, setCustomBudgetInput] = useState<string>(() => savedHomeForm?.customBudgetInput || "");
  const [isCustomBudgetFocused, setIsCustomBudgetFocused] = useState<boolean>(false);
  const [formatPill, setFormatPill] = useState<FormatPillType>(() => savedHomeForm?.formatPill || "Tutto");
  const [hasAlreadyEverything, setHasAlreadyEverything] = useState<boolean>(() => savedHomeForm?.hasAlreadyEverything || false);
  const [extraDetails, setExtraDetails] = useState<string>(() => savedHomeForm?.extraDetails || "");

  // Save form choices to localStorage (step is intentionally not persisted — see wizardStep above).
  // Debounced: this effect re-fires on every keystroke in the free-text fields
  // (extraDetails, customBudgetInput), and a synchronous localStorage.setItem
  // on every character was a measurable source of input lag on mid-range
  // phones -- localStorage I/O blocks the main thread.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("kado_home_form_state", JSON.stringify({
          recipient,
          vibe,
          budget,
          customBudgetInput,
          formatPill,
          hasAlreadyEverything,
          extraDetails,
        }));
      } catch (e) {
        // ignore
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [recipient, vibe, budget, customBudgetInput, formatPill, hasAlreadyEverything, extraDetails]);

  // Fast Track SOS State & Voice Drawer
  const [fastTrackIdea, setFastTrackIdea] = useState<string>("");
  const [isVoiceDrawerOpen, setIsVoiceDrawerOpen] = useState<boolean>(false);
  const [isCameraDrawerOpen, setIsCameraDrawerOpen] = useState<boolean>(false);

  // Haptic feedback helper
  const triggerHaptic = useCallback(() => {
    if (typeof window !== "undefined" && "navigator" in window && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(12);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Handle Step 1 Selection -> Auto advance to Step 2
  const handleSelectRecipient = useCallback((selected: string) => {
    triggerHaptic();
    setRecipient(selected);
    trackWizardStep1(selected);
    setStepDirection(1);
    setWizardStep(2);
  }, [triggerHaptic]);

  // Handle Step 2 Selection -> Auto advance to Step 3
  const handleSelectVibe = useCallback((selected: string) => {
    triggerHaptic();
    setVibe(selected);
    trackWizardStep2(selected);
    setStepDirection(1);
    setWizardStep(3);
  }, [triggerHaptic]);

  // Step Navigation Back
  const handleGoBack = useCallback(() => {
    triggerHaptic();
    if (wizardStep > 1) {
      setStepDirection(-1);
      setWizardStep((prev) => prev - 1);
    }
  }, [triggerHaptic, wizardStep]);

  // Final Submit on Step 3
  const handleFinalSubmit = useCallback(() => {
    triggerHaptic();
    trackWizardStep3({ recipient, vibe, budget, extraDetails });

    onGenerateGifts({
      recipient,
      vibe,
      budget,
      formatPill,
      hasAlreadyEverything,
      extraDetails,
      fastTrackIdea,
    });
  }, [triggerHaptic, recipient, vibe, budget, extraDetails, formatPill, hasAlreadyEverything, fastTrackIdea, onGenerateGifts]);

  /* La scorciatoia: una riga di contesto -- dettata a voce o ricavata da
     una foto -- salta il questionario e fa partire subito la ricerca. */
  const handleFastTrackIdea = useCallback(
    (finalIdea: string) => {
      triggerHaptic();
      setFastTrackIdea(finalIdea);
      trackWizardStep3({ recipient, vibe, budget, extraDetails: finalIdea });
      onGenerateGifts({
        recipient,
        vibe,
        budget,
        formatPill,
        hasAlreadyEverything,
        extraDetails: finalIdea,
        fastTrackIdea: finalIdea,
      });
    },
    [triggerHaptic, recipient, vibe, budget, formatPill, hasAlreadyEverything, onGenerateGifts]
  );

  const recipientOptions = language === "it"
    ? [
        { label: "Partner", icon: Heart },
        { label: "Famiglia", icon: Users },
        { label: "Amico", icon: Smile },
        { label: "Collega", icon: Briefcase },
      ]
    : [
        { label: "Partner", icon: Heart },
        { label: "Family", icon: Users },
        { label: "Friend", icon: Smile },
        { label: "Colleague", icon: Briefcase },
      ];

  const vibeOptions = language === "it"
    ? [
        { label: "Relax", icon: Coffee },
        { label: "Tech", icon: Laptop },
        { label: "Casa", icon: HomeIcon },
        { label: "Viaggi", icon: Compass },
        { label: "Lusso", icon: Crown },
        { label: "Fun", icon: PartyPopper },
      ]
    : [
        { label: "Relax", icon: Coffee },
        { label: "Tech", icon: Laptop },
        { label: "Home", icon: HomeIcon },
        { label: "Travel", icon: Compass },
        { label: "Luxury", icon: Crown },
        { label: "Fun", icon: PartyPopper },
      ];

  const budgetOptions = getBudgetOptions(country.currency, country.symbol);

  // Framer Motion Spring Variants for Wizard Steps
  const stepVariants: Variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.98,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 320,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.18,
      },
    }),
  };

  return (
    <div className="relative w-full flex-1 h-full bg-tactile-linen flex flex-col justify-between overflow-hidden font-sans select-none px-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))] max-w-lg sm:max-w-xl mx-auto pt-2 pb-[max(16px,env(safe-area-inset-bottom,0px))]">
      
      {/* ================= 1. BARRA UNICA FAST-TRACK SOS (Apple Glassmorphism) ================= */}
      <div className="shrink-0 pt-0.5">
        <div
          onClick={() => {
            triggerHaptic();
            setIsVoiceDrawerOpen(true);
            voiceDrawerRef.current?.startListening();
          }}
          className="w-full flex items-center justify-between py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-[18px] bg-[#17111A]/85 backdrop-blur-md border border-[#2B2130] shadow-[0_4px_20px_rgba(60,50,30,0.05)] cursor-pointer active:scale-[0.99] transition-transform group"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#9B8A93] group-hover:text-[#F14B81] transition-colors shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-[#9B8A93] truncate">
              {language === "it"
                ? "Hai un'idea o SOS? Parla o scrivi..."
                : "Have an idea or SOS? Speak or type..."}
            </span>
          </div>

          {wizardStep !== 1 && (
            <div className="flex items-center gap-1.5 pl-2.5 shrink-0 border-l border-[#2B2130]">
              <div className="p-1.5 rounded-full bg-[#F14B81]/10 text-[#F14B81] group-hover:bg-[#F14B81] group-hover:text-[#0E0910] transition-colors">
                <Mic className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
          )}
        </div>

        {/* Wizard Ultra-Thin Continuous Progress Line (2px) */}
        <div className="w-full h-[2px] bg-[#2B2130] rounded-full overflow-hidden mt-2.5">
          <div
            className="h-full bg-[#F14B81] transition-all duration-300 ease-out"
            style={{ width: `${(wizardStep / 3) * 100}%` }}
          />
        </div>

        {/* PERMANENT STEP NAVIGATION BACK BAR FOR STEPS 2 & 3 (Never shifts position) */}
        {wizardStep > 1 && (
          <div className="flex items-center justify-between py-1.5 px-0.5 border-b border-[#2B2130]/80 mt-1">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1.5 text-xs font-bold text-[#F14B81] hover:text-[#D33C6B] active:scale-95 transition-transform py-0.5 px-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>{language === "it" ? "Indietro" : "Back"}</span>
            </button>
            <span className="text-xs font-semibold text-[#9B8A93] truncate max-w-[200px]">
              {wizardStep === 2 ? recipient : `${recipient} • ${vibe}`}
            </span>
          </div>
        )}
      </div>

      {/* ================= 2. SEQUENTIAL WIZARD CONTENT ================= */}
      <div className="flex-1 my-auto relative overflow-y-auto py-2 compact-short-screen">
        {/* I blocchi del passo si distribuiscono sull'altezza invece di
            raggrupparsi al centro con spazi fissi. Su uno schermo alto
            (o senza il banner "installa l'app" in fondo) il vecchio
            justify-center lasciava un buco sotto grande quanto mezzo
            telefono. */}
        <div className="min-h-full flex flex-col">
        <AnimatePresence mode="wait" custom={stepDirection}>
          
          {/* STEP 1: CHI È? */}
          {wizardStep === 1 && (
            <motion.div
              key="step1"
              custom={stepDirection}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1 flex flex-col justify-evenly gap-3 py-2 sm:gap-4"
            >
              <div className="text-center space-y-1">
                <h1 className="text-clamp-title font-bold tracking-tight text-[#F7F0F2]">
                  {language === "it" ? "Per chi è il regalo?" : "Who is the gift for?"}
                </h1>
                <p className="text-sm text-[#9B8A93] font-normal">
                  {language === "it" ? "Seleziona il destinatario per personalizzare" : "Select recipient to customize"}
                </p>
              </div>

              {/* Le due scorciatoie che saltano il questionario: parlare
                  o inquadrare. Il microfono resta il gesto principale (piu
                  grande, acceso); la fotocamera gli sta accanto con lo
                  stesso peso visivo di un'alternativa, non di un ripiego --
                  per certe persone "questa e' la sua stanza" dice piu' di
                  qualsiasi frase. */}
              <div className="flex flex-col items-center gap-1.5 pb-1 pt-1">
                <div className="flex items-end gap-5">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setIsVoiceDrawerOpen(true);
                      voiceDrawerRef.current?.startListening();
                    }}
                    aria-label={language === "it" ? "Tocca e parla" : "Tap to speak"}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                  >
                    {/* Aura: il bagliore radiale magenta-oro dietro il mic,
                        il dispositivo di marca ripetuto in tutta la famiglia. */}
                    <span
                      className="absolute inset-[-55%] rounded-full pointer-events-none"
                      style={{ background: "radial-gradient(closest-side, rgba(241,75,129,0.4), rgba(247,182,98,0.14) 55%, transparent)", filter: "blur(18px)" }}
                    />
                    <span className="absolute inset-0 rounded-full hero-mic-pulse-ring bg-[#F14B81]" />
                    <span className="surface-coral-tactile absolute inset-0 rounded-full shadow-[0_10px_28px_rgba(241,75,129,0.45)]" />
                    <Mic className="relative w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[2.2]" />
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic();
                      setIsCameraDrawerOpen(true);
                    }}
                    aria-label={language === "it" ? "Inquadra e trova" : "Point and find"}
                    className="relative mb-1 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-transform active:scale-95 sm:h-16 sm:w-16"
                    style={{
                      backgroundColor: "#1C1520",
                      boxShadow: "inset 0 0 0 1px rgba(241,75,129,0.45), 0 6px 18px rgba(0,0,0,0.45)",
                    }}
                  >
                    <Camera className="h-6 w-6 text-[#F14B81] stroke-[2.2] sm:h-7 sm:w-7" />
                  </button>
                </div>
                <span className="text-xs font-bold text-[#FF6B9C]">
                  {language === "it" ? "Parla o inquadra" : "Speak or point"}
                </span>
              </div>

              {/* 4 Tactile Apple-Style Physical Buttons */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                {recipientOptions.map((opt) => {
                  const IconComp = opt.icon;
                  const isSel = recipient === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectRecipient(opt.label)}
                      className={`relative h-[95px] sm:h-[110px] p-3 sm:p-3.5 rounded-[20px] border flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 cursor-pointer transition-transform duration-150 active:scale-[0.97] ${
                        isSel
                          ? "surface-coral-selected text-white border-transparent"
                          : "card-tactile text-[#F7F0F2] hover:border-[#F7B662]"
                      }`}
                    >
                      {isSel && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#F14B81] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                        </span>
                      )}
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-colors ${isSel ? "bg-[#F14B81]/20 text-[#FF6B9C]" : "icon-engraved text-[#F14B81]"}`}>
                        <IconComp className="w-5 h-5 sm:w-5 sm:h-5 stroke-[2.2]" />
                      </div>
                      <span className="font-semibold text-sm sm:text-base tracking-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: CHE VIBE HA? */}
          {wizardStep === 2 && (
            <motion.div
              key="step2"
              custom={stepDirection}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1 flex flex-col justify-center space-y-3 py-1"
            >
              <div className="text-center space-y-0.5">
                <h1 className="text-clamp-title font-bold tracking-tight text-[#F7F0F2]">
                  {language === "it" ? "Che vibe ha?" : "What vibe does it have?"}
                </h1>
                <p className="text-sm text-[#9B8A93] font-normal">
                  {language === "it" ? "Scegli lo stile o l'interesse principale" : "Choose the main style or interest"}
                </p>
              </div>

              {/* 2x3 Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 my-auto">
                {vibeOptions.map((opt) => {
                  const IconComp = opt.icon;
                  const isSel = vibe === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectVibe(opt.label)}
                      className={`relative h-[95px] sm:h-[110px] p-2.5 sm:p-3.5 rounded-[20px] border flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer transition-transform duration-150 active:scale-[0.97] ${
                        isSel
                          ? "surface-coral-selected text-white border-transparent"
                          : "card-tactile text-[#F7F0F2] hover:border-[#F7B662]"
                      }`}
                    >
                      {isSel && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#F14B81] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                        </span>
                      )}
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-colors ${isSel ? "bg-[#F14B81]/20 text-[#FF6B9C]" : "icon-engraved text-[#F14B81]"}`}>
                        <IconComp className="w-5 h-5 sm:w-5 sm:h-5 stroke-[2.2]" />
                      </div>
                      <span className="font-semibold text-sm sm:text-base tracking-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: BUDGET E STILE */}
          {wizardStep === 3 && (
            <motion.div
              key="step3"
              custom={stepDirection}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-center space-y-3 sm:space-y-3.5 my-auto"
            >
              <div className="text-center space-y-1">
                <h1 className="text-clamp-title font-bold tracking-tight text-[#F7F0F2]">
                  {language === "it" ? "Budget e Stile" : "Budget & Style"}
                </h1>
                <p className="text-sm text-[#9B8A93] font-normal">
                  {language === "it" ? "Imposta la fascia di prezzo desiderata" : "Set your preferred price range"}
                </p>
              </div>

              {/* Card 1: 2x2 Grid of Budget Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {budgetOptions.map((b) => {
                  const isSel = budget === b && !customBudgetInput;
                  return (
                    <button
                      key={b}
                      onClick={() => {
                        triggerHaptic();
                        setCustomBudgetInput("");
                        setBudget(b);
                      }}
                      className={`relative py-3.5 px-4 sm:py-4 rounded-[22px] border flex flex-col items-center justify-center text-center cursor-pointer transition-transform duration-150 active:scale-[0.97] ${
                        isSel
                          ? "surface-coral-selected text-white border-transparent"
                          : "card-tactile text-[#F7F0F2] hover:border-[#F7B662]"
                      }`}
                    >
                      {isSel && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#F14B81] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                        </span>
                      )}
                      <span className="font-semibold text-base sm:text-lg tracking-tight">{b}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card 2: Custom Budget Card */}
              <div
                className={`p-3.5 rounded-[22px] bg-[#17111A] shadow-[0_4px_14px_-3px_rgba(60,50,30,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] space-y-1.5 transition-colors border ${
                  isCustomBudgetFocused || customBudgetInput
                    ? "border-2 border-[#F14B81]"
                    : "border-[#2B2130]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#9B8A93] block">
                    {language === "it" ? "Oppure cifra esatta:" : "Or exact amount:"}
                  </span>
                  {customBudgetInput && (
                    <span className="text-sm font-bold text-[#F14B81]">
                      {language === "it" ? "Personalizzato" : "Custom"}
                    </span>
                  )}
                </div>

                <div className="relative flex items-center">
                  <span
                    className={`absolute left-3.5 text-sm font-bold transition-colors ${
                      isCustomBudgetFocused || customBudgetInput ? "text-[#F14B81]" : "text-[#9B8A93]"
                    }`}
                  >
                    {country.symbol}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={customBudgetInput}
                    onFocus={() => setIsCustomBudgetFocused(true)}
                    onBlur={() => setIsCustomBudgetFocused(false)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomBudgetInput(val);
                      if (val) {
                        setBudget(formatCustomBudget(val, country.currency, country.symbol));
                      } else {
                        setBudget(getDefaultBudget(country.currency, country.symbol));
                      }
                    }}
                    placeholder={language === "it" ? "Cifra esatta (es. 18)" : "Exact amount (e.g. 18)"}
                    className="w-full py-2.5 pl-8 pr-9 rounded-xl bg-[#1C1520] text-[#F7F0F2] placeholder-[#9B8A93] text-sm font-semibold focus:outline-none transition-colors"
                  />
                  {customBudgetInput && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setCustomBudgetInput("");
                        setBudget(getDefaultBudget(country.currency, country.symbol));
                      }}
                      className="absolute right-2.5 p-1 rounded-full bg-[#2B2130] text-[#9B8A93] hover:text-[#F7F0F2] transition-colors cursor-pointer"
                      title={language === "it" ? "Cancella" : "Clear"}
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card 3: Opzioni Extra */}
              <div className="card-tactile p-3.5 rounded-[22px] space-y-2">
                <span className="text-[10px] font-extrabold text-[#9B8A93] uppercase tracking-wider block">
                  {language === "it" ? "OPZIONI EXTRA" : "EXTRA OPTIONS"}
                </span>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasAlreadyEverything}
                    onChange={(e) => {
                      triggerHaptic();
                      setHasAlreadyEverything(e.target.checked);
                    }}
                    className="w-4 h-4 rounded border-[#2B2130] text-[#F14B81] focus:ring-0 accent-[#F14B81] cursor-pointer"
                  />
                  <span className="text-sm sm:text-base text-[#F7F0F2] font-normal leading-tight">
                    {language === "it"
                      ? "Ha già tutto (idee uniche o consumabili)"
                      : "Has everything already (unique/consumables)"}
                  </span>
                </label>

                <input
                  type="text"
                  value={extraDetails}
                  onChange={(e) => setExtraDetails(e.target.value)}
                  placeholder={
                    language === "it"
                      ? "Dettaglio extra (opzionale)"
                      : "Extra details (optional)"
                  }
                  className="w-full py-2 px-3 rounded-xl bg-[#1C1520] border border-[#2B2130] text-[#F7F0F2] placeholder-[#9B8A93] text-sm sm:text-base font-normal focus:outline-none focus:border-[#F14B81]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* ================= 3. BOTTOM ANCHORED PRIMARY BUTTON ================= */}
      {wizardStep === 3 && (
        <div className="shrink-0 pb-3 pt-2 w-full">
          <button
            onClick={handleFinalSubmit}
            className="surface-coral-tactile w-full py-4 rounded-[22px] hover:brightness-105 active:scale-[0.97] text-[#0E0910] font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_24px_rgba(241,75,129,0.3)] transition-transform uppercase tracking-wide border border-transparent"
          >
            <Sparkles className="w-5 h-5 fill-current text-current" />
            <span>
              {language === "it" ? "MOSTRA REGALI PERFETTI" : "SHOW PERFECT GIFTS"}
            </span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Voce e fotocamera finiscono nello stesso punto: una riga di
          contesto che fa partire la ricerca. Un solo gestore per
          entrambe, cosi non possono divergere. */}
      <VoiceDrawer
        ref={voiceDrawerRef}
        isOpen={isVoiceDrawerOpen}
        onClose={() => setIsVoiceDrawerOpen(false)}
        initialTranscript={fastTrackIdea}
        language={language}
        onSubmitIdea={handleFastTrackIdea}
      />

      <CameraDrawer
        isOpen={isCameraDrawerOpen}
        onClose={() => setIsCameraDrawerOpen(false)}
        language={language}
        onSubmitIdea={handleFastTrackIdea}
      />
    </div>
  );
});
