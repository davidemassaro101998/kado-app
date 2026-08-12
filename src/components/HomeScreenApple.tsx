import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
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
} from "lucide-react";
import { QuizState, FormatPillType } from "../types";
import { Language } from "../data/translations";
import {
  trackPageViewHome,
  trackWizardStep1,
  trackWizardStep2,
  trackWizardStep3,
} from "../lib/analytics";
import { VoiceDrawer } from "./VoiceDrawer";

interface HomeScreenAppleProps {
  onGenerateGifts: (quizData: QuizState) => void;
  language?: Language;
}

export const HomeScreenApple: React.FC<HomeScreenAppleProps> = React.memo(({
  onGenerateGifts,
  language = "it",
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

  const [wizardStep, setWizardStep] = useState<number>(() => savedHomeForm?.wizardStep || 1);
  const [stepDirection, setStepDirection] = useState<number>(1); // 1 = forward, -1 = back

  // Form State
  const [recipient, setRecipient] = useState<string>(() => savedHomeForm?.recipient || "Partner");
  const [vibe, setVibe] = useState<string>(() => savedHomeForm?.vibe || "Tech");
  const [budget, setBudget] = useState<string>(() => savedHomeForm?.budget || "25 - 50€");
  const [customBudgetInput, setCustomBudgetInput] = useState<string>(() => savedHomeForm?.customBudgetInput || "");
  const [isCustomBudgetFocused, setIsCustomBudgetFocused] = useState<boolean>(false);
  const [formatPill, setFormatPill] = useState<FormatPillType>(() => savedHomeForm?.formatPill || "Tutto");
  const [hasAlreadyEverything, setHasAlreadyEverything] = useState<boolean>(() => savedHomeForm?.hasAlreadyEverything || false);
  const [extraDetails, setExtraDetails] = useState<string>(() => savedHomeForm?.extraDetails || "");

  // Save form choices and step to localStorage for seamless background resume
  useEffect(() => {
    try {
      localStorage.setItem("kado_home_form_state", JSON.stringify({
        wizardStep,
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
  }, [wizardStep, recipient, vibe, budget, customBudgetInput, formatPill, hasAlreadyEverything, extraDetails]);

  // Fast Track SOS State & Voice Drawer
  const [fastTrackIdea, setFastTrackIdea] = useState<string>("");
  const [isVoiceDrawerOpen, setIsVoiceDrawerOpen] = useState<boolean>(false);

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

  const recipientOptions = [
    { label: "Partner", icon: Heart },
    { label: "Famiglia", icon: Users },
    { label: "Amico", icon: Smile },
    { label: "Collega", icon: Briefcase },
  ];

  const vibeOptions = [
    { label: "Relax", icon: Coffee },
    { label: "Tech", icon: Laptop },
    { label: "Casa", icon: HomeIcon },
    { label: "Viaggi", icon: Compass },
    { label: "Lusso", icon: Crown },
    { label: "Fun", icon: PartyPopper },
  ];

  const budgetOptions = ["< 25€", "25 - 50€", "50 - 100€", "100€+"];

  // Framer Motion Spring Variants for Wizard Steps
  const stepVariants = {
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
        type: "spring",
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
    <div className="relative w-full flex-1 h-full bg-[#F2F2F7] flex flex-col justify-between overflow-hidden font-sans select-none px-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))] max-w-lg sm:max-w-xl mx-auto pt-2 pb-[max(16px,env(safe-area-inset-bottom,0px))] gpu-layer">
      
      {/* ================= 1. BARRA UNICA FAST-TRACK SOS (Apple Glassmorphism) ================= */}
      <div className="shrink-0 pt-0.5">
        <div
          onClick={() => {
            triggerHaptic();
            setIsVoiceDrawerOpen(true);
          }}
          className="w-full flex items-center justify-between py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-[18px] bg-white/80 backdrop-blur-md border border-[#E5E5EA] shadow-[0_4px_20px_rgba(0,0,0,0.04)] cursor-pointer active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#8E8E93] group-hover:text-[#007AFF] transition-colors shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-[#8E8E93] truncate">
              {language === "it"
                ? "Hai un'idea o SOS? Parla o scrivi..."
                : "Have an idea or SOS? Speak or type..."}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pl-2.5 shrink-0 border-l border-[#E5E5EA]">
            <div className="p-1.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] group-hover:bg-[#007AFF] group-hover:text-white transition-all">
              <Mic className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* Wizard Ultra-Thin Continuous Progress Line (2px) */}
        <div className="w-full h-[2px] bg-[#E5E5EA] rounded-full overflow-hidden mt-2.5">
          <div
            className="h-full bg-[#007AFF] transition-all duration-300 ease-out"
            style={{ width: `${(wizardStep / 3) * 100}%` }}
          />
        </div>

        {/* PERMANENT STEP NAVIGATION BACK BAR FOR STEPS 2 & 3 (Never shifts position) */}
        {wizardStep > 1 && (
          <div className="flex items-center justify-between py-1.5 px-0.5 border-b border-[#E5E5EA]/80 mt-1">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1.5 text-xs font-bold text-[#007AFF] hover:text-[#0062CC] active:scale-95 transition-all py-0.5 px-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>{language === "it" ? "Indietro" : "Back"}</span>
            </button>
            <span className="text-xs font-semibold text-[#8E8E93] truncate max-w-[200px]">
              {wizardStep === 2 ? recipient : `${recipient} • ${vibe}`}
            </span>
          </div>
        )}
      </div>

      {/* ================= 2. SEQUENTIAL WIZARD CONTENT ================= */}
      <div className="flex-1 my-auto flex flex-col justify-center relative overflow-y-auto py-2 compact-short-screen">
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
              className="w-full flex flex-col justify-center space-y-3 sm:space-y-4"
            >
              <div className="text-center space-y-1">
                <h1 className="text-clamp-title font-bold tracking-tight text-[#000000]">
                  {language === "it" ? "Per chi è il regalo?" : "Who is the gift for?"}
                </h1>
                <p className="text-xs text-[#8E8E93] font-normal">
                  {language === "it" ? "Seleziona il destinatario per personalizzare" : "Select recipient to customize"}
                </p>
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
                      className={`h-[95px] sm:h-[110px] p-3 sm:p-3.5 rounded-[20px] border flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-150 active:scale-[0.97] ${
                        isSel
                          ? "bg-[#007AFF] text-white border-[#007AFF] shadow-[0_8px_24px_rgba(0,122,255,0.25)]"
                          : "bg-white text-[#000000] border-[#E5E5EA] shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-[#8E8E93]"
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-colors ${isSel ? "bg-white/20 text-white" : "bg-[#F2F2F7] text-[#007AFF]"}`}>
                        <IconComp className="w-5 h-5 sm:w-5 sm:h-5 stroke-[2.2]" />
                      </div>
                      <span className="font-semibold text-xs sm:text-sm tracking-tight">{opt.label}</span>
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
              className="w-full flex-1 flex flex-col justify-center space-y-3 py-1 gpu-layer"
            >
              <div className="text-center space-y-0.5">
                <h1 className="text-clamp-title font-bold tracking-tight text-[#000000]">
                  {language === "it" ? "Che vibe ha?" : "What vibe does it have?"}
                </h1>
                <p className="text-xs text-[#8E8E93] font-normal">
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
                      className={`h-[95px] sm:h-[110px] p-2.5 sm:p-3.5 rounded-[20px] border flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer transition-all duration-150 active:scale-[0.97] ${
                        isSel
                          ? "bg-[#007AFF] text-white border-[#007AFF] shadow-[0_6px_20px_rgba(0,122,255,0.22)]"
                          : "bg-white text-[#000000] border-[#E5E5EA] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#8E8E93]"
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-colors ${isSel ? "bg-white/20 text-white" : "bg-[#F2F2F7] text-[#007AFF]"}`}>
                        <IconComp className="w-5 h-5 sm:w-5 sm:h-5 stroke-[2.2]" />
                      </div>
                      <span className="font-semibold text-xs sm:text-sm tracking-tight">{opt.label}</span>
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
              className="w-full flex flex-col justify-center space-y-3 sm:space-y-3.5 my-auto gpu-layer"
            >
              <div className="text-center space-y-1">
                <h1 className="text-clamp-title font-bold tracking-tight text-[#000000]">
                  {language === "it" ? "Budget e Stile" : "Budget & Style"}
                </h1>
                <p className="text-xs text-[#8E8E93] font-normal">
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
                      className={`py-3.5 px-4 sm:py-4 rounded-[22px] border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 active:scale-[0.97] ${
                        isSel
                          ? "bg-[#007AFF] text-white border-[#007AFF] shadow-[0_8px_24px_rgba(0,122,255,0.25)]"
                          : "bg-white text-[#000000] border-[#E5E5EA] shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-[#8E8E93]"
                      }`}
                    >
                      <span className="font-semibold text-sm sm:text-base tracking-tight">{b}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card 2: Custom Budget Card */}
              <div
                className={`p-3.5 rounded-[22px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] space-y-1.5 transition-all border ${
                  isCustomBudgetFocused || customBudgetInput
                    ? "border-2 border-[#007AFF]"
                    : "border-[#E5E5EA]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#8E8E93] block">
                    {language === "it" ? "Oppure cifra esatta:" : "Or exact amount:"}
                  </span>
                  {customBudgetInput && (
                    <span className="text-xs font-bold text-[#007AFF]">
                      {language === "it" ? "Personalizzato" : "Custom"}
                    </span>
                  )}
                </div>

                <div className="relative flex items-center">
                  <span
                    className={`absolute left-3.5 text-sm font-bold transition-colors ${
                      isCustomBudgetFocused || customBudgetInput ? "text-[#007AFF]" : "text-[#8E8E93]"
                    }`}
                  >
                    €
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
                        setBudget(`${val}€`);
                      } else {
                        setBudget("25 - 50€");
                      }
                    }}
                    placeholder={language === "it" ? "Cifra esatta (es. 18)" : "Exact amount (e.g. 18)"}
                    className="w-full py-2.5 pl-8 pr-9 rounded-xl bg-[#F2F2F7] text-[#000000] placeholder-[#8E8E93] text-sm font-semibold focus:outline-none transition-colors"
                  />
                  {customBudgetInput && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setCustomBudgetInput("");
                        setBudget("25 - 50€");
                      }}
                      className="absolute right-2.5 p-1 rounded-full bg-[#E5E5EA] text-[#8E8E93] hover:text-[#000000] transition-colors cursor-pointer"
                      title="Cancella"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card 3: Opzioni Extra */}
              <div className="p-3.5 rounded-[22px] bg-white border border-[#E5E5EA] shadow-[0_8px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider block">
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
                    className="w-4 h-4 rounded border-[#E5E5EA] text-[#007AFF] focus:ring-0 accent-[#007AFF] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[#000000] font-normal leading-tight">
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
                  className="w-full py-2 px-3 rounded-xl bg-[#F2F2F7] border border-[#E5E5EA] text-[#000000] placeholder-[#8E8E93] text-xs sm:text-sm font-normal focus:outline-none focus:border-[#007AFF]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= 3. BOTTOM ANCHORED PRIMARY BUTTON ================= */}
      {wizardStep === 3 && (
        <div className="shrink-0 pb-3 pt-2 w-full">
          <button
            onClick={handleFinalSubmit}
            className="w-full py-4 rounded-[22px] bg-[#007AFF] hover:bg-[#0062CC] active:scale-[0.97] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_24px_rgba(0,122,255,0.3)] transition-all uppercase tracking-wide border border-[#007AFF]"
          >
            <Sparkles className="w-5 h-5 fill-current text-current" />
            <span>
              {language === "it" ? "MOSTRA REGALI PERFETTI" : "SHOW PERFECT GIFTS"}
            </span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Voice Drawer Modal */}
      <VoiceDrawer
        isOpen={isVoiceDrawerOpen}
        onClose={() => setIsVoiceDrawerOpen(false)}
        initialTranscript={fastTrackIdea}
        language={language}
        onSubmitIdea={(finalIdea) => {
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
        }}
      />
    </div>
  );
});
