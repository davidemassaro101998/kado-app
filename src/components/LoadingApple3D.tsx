import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, PackageCheck, Gift, Check } from "lucide-react";
import { Language, TRANSLATIONS } from "../data/translations";

interface LoadingApple3DProps {
  language?: Language;
  subtitle?: string;
}

export const LoadingApple3D: React.FC<LoadingApple3DProps> = React.memo(({ language = "en", subtitle }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    t.loadingStep1,
    t.loadingStep2,
    t.loadingStep3,
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 1200);
    const timer2 = setTimeout(() => setActiveStep(2), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 select-none bg-[#F2F2F7] relative overflow-y-auto">
      {/* Background Soft Blue Ambient Depth */}
      <div className="absolute w-80 h-80 bg-[#FF4D6D]/10 rounded-full blur-3xl -top-16 -left-16 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-[#000000]/5 rounded-full blur-3xl -bottom-16 -right-16 pointer-events-none" />

      {/* Cinematic 3D Gift Box Packaging Stage (fluidly scaled to viewport height so it never gets clipped in short/narrow previews) */}
      <div className="relative mb-[clamp(0.75rem,4vh,2rem)] w-[clamp(6rem,26vh,11rem)] h-[clamp(6rem,26vh,11rem)] shrink-0 flex items-center justify-center">
        {/* Outer Orbiting Apple Blue Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#FF4D6D]/40"
        />

        {/* Counter-rotating Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-black/10"
        />

        {/* Floating Gift Box Assembly Vector Animation */}
        <div className="relative z-10 w-[64%] h-[64%] flex items-center justify-center">
          <motion.div
            animate={{
              y: [-4, 4, -4],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-[72%] h-[72%] rounded-2xl bg-white border border-[#FF4D6D] shadow-xl flex items-center justify-center relative overflow-hidden"
          >
            {/* Shimmer light pass */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF4D6D]/10 to-transparent -skew-x-12"
            />

            <Gift className="w-[45%] h-[45%] text-[#FF4D6D]" />
          </motion.div>

          {/* Orbiting Sparkles */}
          <motion.div
            animate={{
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1 right-1 text-[#FF4D6D]"
          >
            <Sparkles className="w-[clamp(0.9rem,3.5vh,1.5rem)] h-[clamp(0.9rem,3.5vh,1.5rem)] fill-[#FF4D6D]" />
          </motion.div>

          <motion.div
            animate={{
              rotate: [360, 180, 0],
              scale: [1, 0.7, 1],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-2 left-1 text-[#000000]"
          >
            <PackageCheck className="w-[clamp(0.75rem,3vh,1.25rem)] h-[clamp(0.75rem,3vh,1.25rem)] text-[#000000]" />
          </motion.div>
        </div>
      </div>

      {/* Micro-text CURATING... */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0.6, 1, 0.6], y: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#000000] uppercase relative z-10 shrink-0"
      >
        {t.curating}
      </motion.p>

      <p className="text-[11px] text-[#68686D] font-medium mt-1 max-w-xs relative z-10 shrink-0">
        {subtitle || t.curatingSub}
      </p>

      {/* Step Progress Assembly List */}
      <div className="mt-[clamp(0.5rem,3vh,1.5rem)] w-full max-w-xs space-y-2 relative z-10 shrink-0">
        {steps.map((stepText, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`p-3 rounded-[16px] border text-xs font-semibold flex items-center gap-3 transition-all duration-300 ${
                isCurrent
                  ? "bg-white border-[#FF4D6D] text-[#000000] shadow-[0_4px_12px_rgba(0,0,0,0.06)] font-extrabold"
                  : isDone
                  ? "bg-white border-[#E5E5EA] text-[#000000] shadow-2xs"
                  : "bg-white/60 border-transparent text-[#68686D]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                  isDone
                    ? "bg-[#34C759] text-white font-black"
                    : isCurrent
                    ? "bg-[#FF4D6D] text-white font-extrabold"
                    : "bg-[#E5E5EA] text-[#68686D]"
                }`}
              >
                {isDone ? <Check className="w-3 h-3 text-white stroke-[3]" /> : idx + 1}
              </div>
              <span className="text-[11px] text-left line-clamp-1">{stepText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
