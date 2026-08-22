import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Language, TRANSLATIONS } from "../data/translations";

interface LoadingApple3DProps {
  language?: Language;
  subtitle?: string;
}

// "Il Rito dei 20 secondi": la promessa del marchio resa teatrale.
// Conto alla rovescia da 20 dentro un anello che si riempie, l'aura
// magenta-oro che respira ai bordi dello schermo, un battito aptico a
// ogni cambio di fase, e la lista delle fasi che avanza. Il rito e
// IDENTICO a ogni ricerca: e la scena che l'utente ricorda (e registra).
// La schermata esce appena i risultati sono pronti, quindi nella pratica
// il countdown quasi mai arriva a zero — la promessa dei 20 secondi
// viene "battuta", mai mancata.
const RITO_TOTAL_SECONDS = 20;
const RING_RADIUS = 106;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const LoadingApple3D: React.FC<LoadingApple3DProps> = React.memo(({ language = "en", subtitle }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [elapsed, setElapsed] = useState(0);

  const steps = [
    t.loadingStep1,
    t.loadingStep2,
    t.loadingStep3,
  ];

  // Fasi a 0s / 4s / 9s: la prima scatta subito, le altre due mentre
  // l'attesa reale (1.5-12s) e ancora in corso.
  const activeStep = elapsed >= 9 ? 2 : elapsed >= 4 ? 1 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => Math.min(prev + 1, RITO_TOTAL_SECONDS));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Battito aptico a ogni cambio fase (il "tick" fisico del rito).
  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(activeStep === 0 ? 12 : 24);
      } catch (e) {
        // ignore
      }
    }
  }, [activeStep]);

  const remaining = Math.max(RITO_TOTAL_SECONDS - elapsed, 0);
  const progress = elapsed / RITO_TOTAL_SECONDS;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 select-none bg-[#0C070D] relative overflow-hidden">
      {/* Aura ai bordi dello schermo: il dispositivo di marca. */}
      <motion.div
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 100px 10px rgba(255,61,127,0.4), inset 0 0 240px 50px rgba(255,178,77,0.15)" }}
      />
      <div className="absolute -top-28 -left-28 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(255,61,127,0.35), transparent)", filter: "blur(36px)" }} />
      <div className="absolute -bottom-24 -right-28 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(255,178,77,0.28), transparent)", filter: "blur(36px)" }} />

      {/* Titolo del rito */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-extrabold tracking-[0.3em] text-[#B8A9B0] uppercase">Kado AI</span>
        <h2
          className="text-xl sm:text-2xl text-[#F7F0F2] leading-tight"
          style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
        >
          {t.curating}
        </h2>
        <p className="text-[11px] text-[#9B8A93] font-medium max-w-xs">
          {subtitle || t.curatingSub}
        </p>
      </div>

      {/* Anello countdown (fluidamente scalato: mai clippato su schermi bassi) */}
      <div className="relative z-10 my-[clamp(0.75rem,3.5vh,2rem)] w-[clamp(11rem,32vh,15rem)] h-[clamp(11rem,32vh,15rem)] shrink-0 flex items-center justify-center">
        <div className="absolute inset-[-14%] rounded-full pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(255,61,127,0.3), rgba(255,178,77,0.1) 60%, transparent)", filter: "blur(26px)" }} />
        <svg viewBox="0 0 240 240" className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="120" cy="120" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
          <circle
            cx="120"
            cy="120"
            r={RING_RADIUS}
            fill="none"
            stroke="url(#ritoRingGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          <defs>
            <linearGradient id="ritoRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FF3D7F" />
              <stop offset="1" stopColor="#FFB24D" />
            </linearGradient>
          </defs>
        </svg>
        <div className="relative flex flex-col items-center gap-0.5">
          <span
            className="text-[clamp(3.5rem,11vh,5.5rem)] leading-none bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              backgroundImage: "linear-gradient(135deg, #FF3D7F, #FFB24D)",
              WebkitBackgroundClip: "text",
            }}
          >
            {remaining}
          </span>
          <span className="text-[10px] font-bold tracking-[0.22em] text-[#9B8A93] uppercase">
            {language === "it" ? "secondi" : "seconds"}
          </span>
        </div>
      </div>

      {/* Step Progress Assembly List */}
      <div className="relative z-10 w-full max-w-xs space-y-2 shrink-0">
        {steps.map((stepText, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`p-3 rounded-[16px] border text-xs font-semibold flex items-center gap-3 transition-all duration-300 ${
                isCurrent
                  ? "bg-[rgba(255,61,127,0.1)] border-[rgba(255,61,127,0.45)] text-[#F7F0F2] shadow-[0_0_24px_rgba(255,61,127,0.18)] font-extrabold"
                  : isDone
                  ? "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#F7F0F2]"
                  : "bg-[rgba(255,255,255,0.03)] border-transparent text-[#8E7F87]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                  isDone
                    ? "bg-[#FF3D7F] text-white font-black"
                    : isCurrent
                    ? "border-2 border-[#FF3D7F] shadow-[0_0_12px_rgba(255,61,127,0.6)]"
                    : "bg-[rgba(255,255,255,0.08)] text-[#8E7F87]"
                }`}
              >
                {isDone ? (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                ) : isCurrent ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D7F]" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className="text-[11px] text-left line-clamp-1">{stepText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
